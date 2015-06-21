import config from '../config.json';
import * as PlayerAction from '../service-actions/player';
import * as GameAction from '../service-actions/game';
import * as GameUtil from '../util/game';

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
    id = GameUtil.zeroFill(GameUtil.random());
    isExist = await gameExists(id);
  } while (isExist);

  return id;
}

class FirebaseService {

  constructor() {
    let player_id = localStorage.getItem('player_id');
    if (!player_id) {
      this.player = playersRef.push();
      let player_id = this.player.key();
      localStorage.setItem('player_id', player_id);
    } else {
      this.player = playersRef.child(player_id);
    }

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
      status: 'waiting'
    });
    return id;
  }

  joinGame(id) {
    this.game = gamesRef.child(id);
    this.game.on('value', ds => {
      GameAction.gameData({ id, ...ds.val() });
    });
  }

  exitGame() {
    this.game.off('value');
    GameAction.exitGame();
  }

}

export default new FirebaseService();
