import firebaseService from '../services/firebase';

export function start() {
  return firebaseService.startGame();
}

export function changeLife(amount) {
  firebaseService.changeLife(amount);
}
