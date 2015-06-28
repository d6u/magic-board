// Global style must be loaded
import style from './global.scss';

// Must init route service
import routeService from './services/route';

import React from 'react';
import App from './components/app';
import {initService} from './services/firebase';

initService().then(function () {
  React.initializeTouchEvents(true);
  React.render(<App />, document.getElementById('app'));
});
