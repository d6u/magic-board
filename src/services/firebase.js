import config from '../config.json';
import * as PlayerAction from '../actions/player';
import * as GameAction from '../actions/game';
import * as GameUtil from '../util/game';
import {Map} from 'immutable';

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
    this.playerCache = {};
    this.gameCache = {};

    syncPlayer().then(({player_id, player}) => {
      this.player = player;
      complete();
      this.player.on('value', ss => {
        this.playerCache = Map({player_id, ...ss.val()});
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

        // Go ahead update store
        GameAction.gameData(Map(gameData));

        this.game = game;

        this.game.on('value', ss => {
          GameAction.gameData(Map({game_id, ...ss.val()}));
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
    this.game.update({
      status: 'counting'
    });

    this.game.child('player1').update({
      life: 20,
    });

    this.game.child('player2').update({
      life: 20,
    });
  }

  // exitGame() {
  //   this.game.off('value');
  //   GameAction.exitGame();
  // }

  //
  // changeLife(amount) {
  //   this.game.once('value', ss => {
  //
  //     let playerKey;
  //
  //     if (ss.val().player1.id === this.player.key()) {
  //       playerKey = 'player1';
  //     } else {
  //       playerKey = 'player2';
  //     }
  //
  //     this.game.child(`${playerKey}/life`).transaction(currentLife => {
  //       return currentLife + amount;
  //     });
  //   });
  // }
  //
  // gameOver() {
  //   this.game.once('value', ss => {
  //
  //     let winKey;
  //     let loseKey;
  //
  //     if (ss.val().player1.life > ss.val().player2.life) {
  //       winKey = 'player1';
  //       loseKey = 'player2';
  //     } else {
  //       winKey = 'player2';
  //       loseKey = 'player1';
  //     }
  //
  //     this.game.child(winKey).update({
  //       result: 'WIN',
  //     });
  //
  //     this.game.child(loseKey).update({
  //       result: 'LOSE',
  //     });
  //
  //     this.game.update({
  //       status: 'result',
  //     });
  //
  //   });
  // }

}

let _resolve;
let loadFirebase = new Promise(resolve => _resolve = resolve);

export default new FirebaseService({complete: _resolve});

export function initFirebaseService() {
  return loadFirebase;
}
