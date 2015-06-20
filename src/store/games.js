const gamesRef = new Firebase('https://glowing-torch-4886.firebaseio.com/games');

function random() {
  return Math.floor(Math.random() * 10000);
}

function zeroFill(n) {
  let digits = n.toString(10).split('');
  while (digits.length < 4) {
    digits.unshift('0');
  }
  return digits.join('');
}

function allGames() {
  return new Promise(res => {
    gamesRef.once( 'value', data => res(data.val()) );
  });
}

async function randomGameId() {
  let games = await allGames() || {};
  let id;

  do {
    id = zeroFill(random());
  } while (games[id]);

  return id;
}

class GameStore {

  constructor() {
    this.game = null;
    this.eventHandlers = new Map();
  }

  /**
   * Register event callbacks
   *
   * All possible event names:
   *   'new game created'   -> waiting screen - (id: string)
   *   'all players joined' -> roll           -
   *   'game starts'        -> counting lives
   *   'game ends'          -> results
   *
   * @param  {string}   name
   * @param  {Function} handler
   * @return {void}
   */
  register(name, handler) {
    let handlers = this.eventHandlers.get(name);

    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(name, handlers);
    }

    handlers.add(handler);
  }

  deregister(name, handler) {
    let handlers = this.eventHandlers.get(name);

    if (handlers) {
      handlers.delete(handler);
    }
  }

  trigger(name, data) {
    let handlers = this.eventHandlers.get(name);

    if (handlers) {
      for (let h of handlers) {
        h(data);
      }
    }
  }

  async newGame() {
    let id = await randomGameId();
    gamesRef.child(id).set({
      status: 'waiting'
    });
    this.trigger('new game created', { id });
  }

  joinGame(id) {
    this.game = gamesRef.child(id);
  }

}

export default new GameStore();
