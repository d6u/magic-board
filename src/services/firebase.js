import config from '../config.json';
import * as PlayerAction from '../service-actions/player';

const firebase = new Firebase(config.firebase_url);
const playersRef = firebase.child('players');
const gamesRef = firebase.child('games');

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
  }

  joinGame(game_id) {
    return new Promise((res, rej) => {
      gamesRef.child(game_id).once('value', ds => {
        if (ds.exists()) {
          res();
        } else {
          rej();
        }
      });
    });
  }

}

export default new FirebaseService();
