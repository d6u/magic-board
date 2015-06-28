import BaseStore from './base';
import {Map} from 'immutable';

class Store extends BaseStore {

  constructor() {
    super();
    this.player = {};
    this.routes = Map();
    this.game = Map();
  }

  playerData(data) {
    this.player = data;
  }

  /**
   * @param  {Immutable.Map} data An Immutable Map object contains all game data
   * @return {void}
   */
  gameData(data) {
    this.game = this.game.merge(data);
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
