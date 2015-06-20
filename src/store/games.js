export let games = new Firebase('https://glowing-torch-4886.firebaseio.com/games');

function randomId() {
  return Math.floor(Math.random() * 10000);
}

function allGames() {
  return new Promise(resolve => {
    games.once( 'value', data => resolve(data.val()) );
  });
}

export async function newGame() {
  let id;
  let games;
  do {
    id = randomId();
    games = await allGames();
  } while (games[id]);
  return id;
}
