import React from 'react';
import store from '../store/store';
import Home from '../views/home';
import Join from '../views/join';
import Game from '../views/game';
import style from './app.scss';

export default React.createClass({

  getInitialState() {
    store.register('routeChange', routes => {
      this.setState(routes);
    });
    return store.routes;
  },

  render() {
    let home = this.state.get('home') ? <Home /> : null;
    let join = this.state.get('join') ? <Join /> : null;
    let game = this.state.get('game') ? <Game game={this.state.get('game')} /> : null;

    return (
      <div className={style['app']}>
        {home}
        {join}
        {game}
      </div>
    );
  },

});
