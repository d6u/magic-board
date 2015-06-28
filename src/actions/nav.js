import firebaseService from '../services/firebase';

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
