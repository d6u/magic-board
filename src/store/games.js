export let games = new Firebase('https://glowing-torch-4886.firebaseio.com/games');

export function allGames() {
  return new Promise(resolve => {
    games.once( 'value', data => resolve(data.val()) );
  });
}
