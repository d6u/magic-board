import BaseStore from './base';
import {Map} from 'immutable';

class Store extends BaseStore {

  constructor() {
    super();
    this.routes = Map();
    this.player = {};
    this.game = {};
  }

  playerData(data) {
    this.player = data;
  }

  gameData(data) {
    this.game = data;
    this.trigger('gameData', this.game);
  }

  /**
   * @param  {Immutable.Map} state An Immutable Map object contains all routes data
   * @return {void}
   */
  routeChange(state) {
    this.routes = this.routes.merge(state);
    this.trigger('routeChange', this.routes);
  }

}

export default new Store();
