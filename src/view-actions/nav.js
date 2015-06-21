import firebaseService from '../services/firebase';

export function navTo(path) {
  location.hash = path;
}

export function joinGame(game_id) {
  return firebaseService.couldJoinGame(game_id)
    .then(function () {
      navTo(`/game/${game_id}`);
    });
}
