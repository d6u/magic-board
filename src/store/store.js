import BaseStore from './base';

class Store extends BaseStore {

  constructor() {
    super();
    this.player = {};
    this.game = {};
    this.routes = {};
  }

  playerData(data) {
    this.player = data;
  }

  gameData(data) {
    this.game = data;
    this.trigger('gameData', this.game);
  }

  exitGame() {
    this.game = {};
    this.trigger('gameData', this.game);
  }

  /**
   * Called when route action emits
   * @param  {Immutable.Map} state An Immutable Map object contains all routes
   *                               data
   * @return {void}
   */
  routeChange(state) {
    this.routes = state.toJS();
    this.trigger('routeChange', this.routes);
  }

}

export default new Store();
