import React from 'react';
import Home from '../views/home';
import Join from '../views/join';
import Game from '../views/game';
import ModalMenu from '../components/modal-menu';
import store from '../store/store';
import style from './app.scss';

export default React.createClass({

  getInitialState() {
    store.register('routeChange', routes => {
      this.setState({routes});
    });
    store.register('uiChange', ui => {
      this.setState({ui});
    });
    return {routes: store.routes, ui: store.ui};
  },

  render() {
    let home = this.state.routes.get('home') ? <Home /> : null;
    let join = this.state.routes.get('join') ? <Join /> : null;
    let game = this.state.routes.get('game') ? <Game game={this.state.routes.get('game')} /> : null;
    let menu = this.state.ui.get('showMenu') ? <ModalMenu /> : null;

    return (
      <div className={style['app']}>
        {menu}
        {home}
        {join}
        {game}
      </div>
    );
  },

});
