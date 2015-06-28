import BaseStore from './base';
import {Map} from 'immutable';

class Store extends BaseStore {

  constructor() {
    super();
    this.player = Map();
    this.routes = Map();
    this.game = Map();
  }

  playerData(data) {
    this.player = this.player.merge(data);
  }

  /**
   * @param  {Immutable.Map} data An Immutable Map object contains all game data
   * @return {void}
   */
  gameData(data) {
    this.game = this.game.merge(data);
    this.trigger('gameData', this.game);
  }

  changeLife(amount) {
    let keyPath = ['life'];

    if (this.game.getIn(['player1', 'id']) === this.player.get('player_id')) {
      keyPath.unshift('player1');
    } else {
      keyPath.unshift('player2');
    }

    this.game.updateIn(keyPath, life => life + amount);
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
