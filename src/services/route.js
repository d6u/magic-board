import RouteRegistry from '../util/route-registry';
import firebaseService from './firebase';
import * as RouteAction from '../service-actions/route';
import {navTo} from '../util/nav';
import Immutable from 'immutable';

class RouteService {

  constructor() {

    let self = this;

    this.state = new Immutable.Map({
      home: null,
      join: null,
      game: null
    });

    this.routeRegistry = new RouteRegistry({

      '/'({isEnter}) {
        self.state = self.state.set('home', isEnter ? {} : null);
        if (isEnter) {
          RouteAction.routeChange(self.state);
        }
      },

      '/join'({isEnter}) {
        self.state = self.state.set('join', isEnter ? {} : null);
        if (isEnter) {
          RouteAction.routeChange(self.state);
        }
      },

      '/game/:game_id'({isEnter, id}) {
        self.state = self.state.set('game', isEnter ? {id} : null);
        if (isEnter) {
          RouteAction.routeChange(self.state);
          firebaseService.joinGame(id);
        } else {
          firebaseService.exitGame();
        }
      },

      '*'({isEnter}) {
        navTo('/');
      }

    });
  }

}

export default new RouteService();
