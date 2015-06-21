import React from 'react';
import App from './components/app';

// Initialize application
import style from './global.scss';
import store from './store/store';
import firebaseService from './services/firebase';
import routeService from './services/route';

React.render(<App />, document.getElementById('app'));
