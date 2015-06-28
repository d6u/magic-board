import firebaseService from '../services/firebase';
import store from '../store/store';

export function gameData(data) {
  store.gameData(data);
}

export function exitGame() {
  store.exitGame();
}

export function start() {
  return firebaseService.startGame();
}

export function changeLife(amount) {
  firebaseService.changeLife(amount);
}

export function gameOver() {
  firebaseService.gameOver();
}

export function newGame() {
  firebaseService.newGame()
    .then(function (game_id) {
      navTo(`/game/${game_id}`);
    });
}

export function joinGame(game_id) {
  return firebaseService.couldJoinGame(game_id)
    .then(function () {
      navTo(`/game/${game_id}`);
    });
}
