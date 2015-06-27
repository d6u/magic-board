import RouteRegistry from '../util/route-registry';
import firebaseService from './firebase';
import * as RouteAction from '../service-actions/route';
import {navTo} from '../util/nav';

class RouteService {

  constructor() {
    this.routeRegistry = new RouteRegistry({

      '/'({isEnter}) {
        RouteAction.routeChange('home', isEnter);
      },

      '/join'({isEnter}) {
        RouteAction.routeChange('join', isEnter);
      },

      '/game/:id'({isEnter, id}) {
        RouteAction.routeChange('game', isEnter);
        if (isEnter) {
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
