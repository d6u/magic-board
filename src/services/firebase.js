import config from '../config.json';
import * as PlayerAction from '../service-actions/player';
import * as GameAction from '../service-actions/game';
import * as GameUtil from '../util/game';
import store from '../store/store';

const firebase = new Firebase(config.firebase_url);
const playersRef = firebase.child('players');
const gamesRef = firebase.child('games');

function gameExists(id) {
  return new Promise(res => {
    gamesRef.child(id).once('value', ds => res(ds.exists()));
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
    syncPlayer().then(({player_id, player}) => {
      this.player = player;
      complete();
      this.player.on('value', ss => {
        PlayerAction.playerData({player_id, ...ss.val()});
      });
    });
  }

  couldJoinGame(game_id) {
    return new Promise((res, rej) => {
      gamesRef.child(game_id)
        .once('value', ds => {
          if (ds.exists()) {
            res();
          } else {
            rej();
          }
        });
    });
  }

  async newGame() {
    let id = await randomGameId();
    gamesRef.child(id).set({
      status: 'waiting',
      player1: {
        id: store.player.player_id,
        color: 'FFFFFF',
      }
    });
    return id;
  }

  joinGame(id) {
    this.game = gamesRef.child(id);

    this.game.once('value', ds => {

      let data = ds.val();

      if (data.status === 'waiting')
      {
        if (data.player1.id !== store.player.player_id)
        {
          let [roll1, roll2] = GameUtil.roll();

          this.game.child('player1').update({
            roll: roll1,
          });

          this.game.update({
            player2: {
              id: store.player.player_id,
              roll: roll2,
              color: '000000',
            },
            status: 'rolling',
          });
        }
      }
    });

    this.game.on('value', ds => {
      let data = ds.val();
      GameAction.gameData({id, ...data});
    });
  }

  exitGame() {
    this.game.off('value');
    GameAction.exitGame();
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

  changeLife(amount) {
    let playerKey;

    if (store.player.player_id === store.game.player1.id) {
      playerKey = 'player1';
    } else {
      playerKey = 'player2';
    }

    this.game.child(`${playerKey}/life`).transaction(currentLife => {
      return currentLife + amount;
    });
  }

  gameOver() {
    let winKey;
    let loseKey;

    if (store.game.player1.life > store.game.player2.life) {
      winKey = 'player1';
      loseKey = 'player2';
    } else {
      winKey = 'player2';
      loseKey = 'player1';
    }

    this.game.child(winKey).update({
      result: 'WIN',
    });

    this.game.child(loseKey).update({
      result: 'LOSE',
    });

    this.game.update({
      status: 'result',
    });
  }

}

let _resolve;
let loadFirebase = new Promise(resolve => _resolve = resolve);

export default new FirebaseService({complete: _resolve});

export function initService() {
  return loadFirebase;
}
