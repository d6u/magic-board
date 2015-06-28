// Global style must be loaded
import style from './global.scss';

import React from 'react';
import App from './controller-views/app';
import {initFirebaseService} from './services/firebase';
import {initRouteService} from './services/route';

Promise
  .all([
    initFirebaseService(),
    initRouteService(),
  ])
  .then(function () {
    React.initializeTouchEvents(true);
    React.render(<App />, document.getElementById('app'));
  });
