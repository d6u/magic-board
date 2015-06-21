import routeRegistry from '../util/route-registry';
import firebaseService from './firebase';
import * as RouteAction from '../service-actions/route';

class RouteService {

  constructor() {
    routeRegistry.register('/', function ({isEnter}) {
      RouteAction.routeChange('home', isEnter);
    });

    routeRegistry.register('/join', function ({isEnter}) {
      RouteAction.routeChange('join', isEnter);
    });

    routeRegistry.register('/game/:id', function ({isEnter, id}) {
      RouteAction.routeChange('game', isEnter);
      if (isEnter) {
        firebaseService.joinGame(id);
      } else {
        firebaseService.exitGame();
      }
    });
  }

}

export default new RouteService();
