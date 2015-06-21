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

class FirebaseService {

  constructor({complete}) {
    let player_id = localStorage.getItem('player_id');
    if (!player_id) {
      this.player = playersRef.push({
        // Act like a placeholder, `push(null)` won't add any object to Firebase
        version: 'v1'
      });
      let player_id = this.player.key();
      localStorage.setItem('player_id', player_id);
    } else {
      this.player = playersRef.child(player_id);
    }

    this.player.once('value', () => complete());

    this.player.on('value', ds => {
      PlayerAction.playerData({ player_id, ...ds.val() });
    });

    this.game = null;
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

}

let complete;
let isComplete = new Promise(res => complete = res);

export default new FirebaseService({complete});

export function initService() {
  return isComplete;
}
