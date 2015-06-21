import store from '../store/store';

export function gameData(data) {
  store.gameData(data);
}

export function exitGame() {
  store.exitGame();
}
