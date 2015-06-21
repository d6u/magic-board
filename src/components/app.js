import React from 'react';
import store from '../store/store';
import Home from './home';
import Join from './join';
import Game from './game';
import style from './app.scss';

export default React.createClass({

  getInitialState() {
    store.register('routeChange', routes => {
      this.setState(routes);
    });

    return store.routes;
  },

  render() {
    let home = this.state.home ? <Home /> : null;
    let join = this.state.join ? <Join /> : null;
    let game = this.state.game ? <Game /> : null;

    return (
      <div className={ style['app'] }>
        { home }
        { join }
        { game }
      </div>
    );
  },

});
