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
