import RouteRegistry from '../util/route-registry';
import firebaseService, {initFirebaseService} from './firebase';
import * as RouteAction from '../actions/route';
import {makeIterable} from '../utils/collection';
import {Map} from 'immutable';

class RouteService {

  constructor({complete}) {
    this.state = Map({
      home: null,
      join: null,
      game: null
    });

    initFirebaseService()
      .then(() => this.initRegistry())
      .then(complete);
  }

  /**
   * Initialize route registry property
   * @return {void}
   */
  initRegistry() {
    const self = this;

    this.routeRegistry = new RouteRegistry({

      '/'({isEnter}) {
        self.state = self.state.set('home', isEnter ? Map() : null);
        if (isEnter) {
          RouteAction.routeChange(self.state);
        }
      },

      '/join'({isEnter}) {
        self.state = self.state.set('join', isEnter ? Map() : null);
        if (isEnter) {
          RouteAction.routeChange(self.state);
        }
      },

      '/game/:game_id'({isEnter, game_id}) {
        let newState = Map({game_id});
        self.state.set('game', isEnter ? newState : null);
        if (isEnter) {
          RouteAction.routeChange(self.state);
          firebaseService.joinGame(game_id);
        }
        // else {
        //   firebaseService.exitGame();
        // }
      },

      /**
       * For entering non-recongnized route, navigate to home
       * @param  {Boolean} .isEnter
       * @return {void}
       */
      '*'({isEnter}) {
        if (isEnter) self.navTo('/');
      }

    });
  }

  /**
   * Navigate to a path
   * @param  {string} path Url path
   * @return {void}
   */
  navTo(path) {
    location.hash = path;
  }

}

let _resolve;
let loadRoute = new Promise(resolve => _resolve = resolve);

export default new RouteService({complete: _resolve});

export function initRouteService() {
  return loadRoute;
}
