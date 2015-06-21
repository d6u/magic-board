import BaseStore from './base';

class Store extends BaseStore {

  constructor() {
    super();
    this.player = null;
    this.routes = {
      home: false,
      game: false,
      join: false,
    };
  }

  playerData(data) {
    this.player = data;
  }

  routeChange(name, isEnter) {
    this.routes[name] = isEnter;
    this.trigger('routeChange', this.routes);
  }

}

export default new Store();
