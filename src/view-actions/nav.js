import firebaseService from '../services/firebase';
import routeService from '../services/route';

export function navTo(path) {
  routeService.navTo(path);
}

export function joinGame(game_id) {
  return firebaseService.couldJoinGame(game_id)
    .then(function () {
      navTo(`/game/${game_id}`);
    });
}

export function newGame() {
  firebaseService.newGame()
    .then(function (id) {
      navTo(`/game/${id}`);
    });
}
