import BaseStore from './base';

class Store extends BaseStore {

  constructor() {
    super();
    this.player = null;
    this.game = {};
    this.routes = {
      home: false,
      game: false,
      join: false,
    };
  }

  playerData(data) {
    this.player = data;
  }

  gameData(change) {
    this.game = {...this.game, ...change};
    this.trigger('gameData', this.game);
  }

  exitGame() {
    this.game = {};
    this.trigger('gameData', this.game);
  }

  routeChange(name, isEnter) {
    this.routes[name] = isEnter;
    this.trigger('routeChange', this.routes);
  }

}

export default new Store();
