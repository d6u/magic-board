// Global style must be loaded
import style from './global.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './controller-views/app';
import {initFirebaseService} from './services/firebase';
import {initRouteService} from './services/route';
import {initAdjustingREM} from './utils/ui';

initAdjustingREM();

Promise
  .all([
    initFirebaseService(),
    initRouteService(),
  ])
  .then(function () {
    ReactDOM.render(<App />, document.getElementById('app'));
  });
