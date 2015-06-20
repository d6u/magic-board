import React from 'react';
import App from './components/app';
import style from './global.scss';

React.initializeTouchEvents(true);

React.render(<App />, document.getElementById('app'));
