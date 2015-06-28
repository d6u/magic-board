import config from '../config.json';
import * as PlayerAction from '../actions/player';
import * as GameAction from '../actions/game';
import * as GameUtil from '../utils/game';
import Immutable, {Map} from 'immutable';
import merge from 'lodash/object/merge';

const firebase = new Firebase(config.firebase_url);
const playersRef = firebase.child('players');
const gamesRef = firebase.child('games');

function gameExists(id) {
  return new Promise(resolve => {
    gamesRef.child(id).once('value', ss => resolve(ss.exists()));
  });
}

async function randomGameId() {
  let id;
  let isExist;

  do {
    id = GameUtil.randomGameId();
    isExist = await gameExists(id);
  } while (isExist);

  return id;
}

/**
 * Add new player data to remote and save id to localStorage
 *
 * @return {string}   .player_id
 * @return {Firebase} .player
 */
function addNewPlayer() {
  let player = playersRef.push({version: 'v1'});
  let player_id = player.key();
  localStorage.setItem('player_id', player_id);
  return {player_id, player};
}

/**
 * Will attempt to sync localStorage player_id with remote. If value cannot
 * matched (one does not exist, or not equal), or neither player_id exists,
 * it will try to create a new player_id and remove the mismatched one.
 *
 * @return {Promise} Resolve with {player_id: string, player: Firebase}
 */
function syncPlayer() {
  return new Promise(resolve => {
    let player_id = localStorage.getItem('player_id');
    let player;

    if (!player_id) {
      resolve(addNewPlayer());
    }
    else {
      player = playersRef.child(player_id);
      player.once('value', ss => {
        if (ss.exists()) {
          resolve({player_id, player});
        }
        else {
          localStorage.removeItem('player_id');
          resolve(addNewPlayer());
        }
      });
    }

  });
}

class FirebaseService {

  constructor({complete}) {
    this.playerCache = Map();
    this.gameCache = Map();

    syncPlayer().then(({player_id, player}) => {
      this.player = player;
      complete();
      this.player.on('value', ss => {
        this.playerCache = Immutable.fromJS({player_id, ...ss.val()});
        PlayerAction.playerData(this.playerCache);
      });
    });
  }

  /**
   * Create a new game in remote
   * @return {Promise} Resolve with game_id
   */
  newGame() {
    return randomGameId()
      .then(game_id => {
        return new Promise(resolve => {

          let gameData = {
            status: 'waiting',
            player1: {
              id: this.playerCache.get('player_id'),
              color: 'FFFFFF',
            }
          };

          gamesRef.child(game_id).set(gameData, function () {
            resolve(game_id);
          });

        });
      });
  }

  /**
   * Test to see if game exists
   * @param  {string}  game_id
   * @return {Promise} Resolve with game Firebase endpoint and game data
   */
  couldJoinGame(game_id) {
    return new Promise((resolve, reject) => {
      let game = gamesRef.child(game_id);

      game.once('value', ss => {
        if (ss.exists()) {
          resolve([game, ss.val()]);
        } else {
          reject(new Error(`Game ${game_id} does not exist`));
        }
      });
    });
  }

  joinGame(game_id) {
    return this.couldJoinGame(game_id)
      .then(([game, gameData]) => {

        this.gameCache = Immutable.fromJS(gameData);

        // Go ahead update store
        GameAction.gameData(this.gameCache);

        this.game = game;

        this.game.on('value', ss => {
          this.gameCache = Immutable.fromJS({game_id, ...ss.val()});
          GameAction.gameData(this.gameCache);
        });

        let player_id = this.playerCache.get('player_id');

        if (gameData.status === 'waiting')
        {
          if (gameData.player1.id !== player_id)
          {
            let [roll1, roll2] = GameUtil.roll();

            this.game.child('player1').update({
              roll: roll1,
            });

            this.game.update({
              player2: {
                id: player_id,
                roll: roll2,
                color: '000000',
              },
              status: 'rolling',
            });
          }
        }
      });
  }

  startGame() {
    this.game.transaction((current) => {
      return merge(current, {
        status: 'counting',
        player1: {
          life: 20,
          result: null,
        },
        player2: {
          life: 20,
          result: null
        }
      })
    });
  }

  changeLife(amount) {
    let playerKey;

    if (this.gameCache.getIn(['player1', 'id']) === this.playerCache.get('player_id')) {
      playerKey = 'player1';
    } else {
      playerKey = 'player2';
    }

    this.game.child(`${playerKey}/life`).transaction(currentLife => {
      return currentLife + amount;
    });
  }

  gameOver() {
    let life1 = this.gameCache.getIn(['player1', 'life']);
    let life2 = this.gameCache.getIn(['player2', 'life']);
    let [winKey, loseKey] = life1 > life2 ? ['player1', 'player2'] : ['player2', 'player1'];

    this.game.transaction((current) => {
      return merge(current, {
        status: 'result',
        [winKey]: {
          result: 'WIN'
        },
        [loseKey]: {
          result: 'LOSE'
        }
      });
    });
  }

  // exitGame() {
  //   this.game.off('value');
  //   GameAction.exitGame();
  // }

  //
  //

}

let _resolve;
let loadFirebase = new Promise(resolve => _resolve = resolve);

export default new FirebaseService({complete: _resolve});

export function initFirebaseService() {
  return loadFirebase;
}
