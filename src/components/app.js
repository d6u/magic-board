import React from 'react';
import router from '../store/route';
import gamesStore from '../store/games';
import Home from './home';
import Join from './join';
import Game from './game';
import style from './app.scss';

export default React.createClass({

  getInitialState() {
    return {
      home: false,
      game: false,
      join: false,
    };
  },

  componentDidMount() {
    router.register('/', event => {
      this.setState({home: event.type === 'enter'});
    });

    router.register('/join', event => {
      this.setState({join: event.type === 'enter'});
    });

    router.register('/game/:id', event => {
      this.setState({game: event.type === 'enter'});
    });

    gamesStore.register('new game created', ({id}) => {
      location.hash = `/game/${id}`;
    });
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
