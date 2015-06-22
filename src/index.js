import React from 'react';
import App from './components/app';

// Initialize application
import style from './global.scss';
import store from './store/store';
import { initService } from './services/firebase';
import routeService from './services/route';

initService().then(function () {
  React.initializeTouchEvents(true);
  React.render(<App />, document.getElementById('app'));
});
