import store from '../store/store';

export function gameData(change) {
  store.gameData(change);
}

export function exitGame() {
  store.exitGame();
}
