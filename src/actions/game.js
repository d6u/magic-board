import firebaseService from '../services/firebase';
import routeService from '../services/route';
import store from '../store/store';
import {Map} from 'immutable';

export function newGame() {
  firebaseService.newGame()
    .then(function (game_id) {
      routeService.navTo(`/game/${game_id}`);
    });
}

export function joinGame(game_id) {
  return firebaseService.joinGame(game_id)
    .then(function () {
      routeService.navTo(`/game/${game_id}`);
    });
}

export function gameData(data) {
  store.gameData(data);
}

export function start() {
  return firebaseService.startGame();
}

export function changeLife(amount) {
  firebaseService.changeLife(amount);
  store.changeLife(amount);
}

export function gameOver() {
  firebaseService.gameOver();
}

export function concede() {
  firebaseService.concede();
  store.uiChange(Map({
    showMenu: false
  }));
}
