import React from 'react';
import GameWaiting from './game-waiting';
import GameBoard from './game-board';
import style from './game.scss';
import store from '../store/store';

export default React.createClass({

  getInitialState() {
    return store.game;
  },

  componentDidMount() {
    store.register('gameData', data => {
      this.setState(data);
    });
  },

  render() {
    let waiting = null;
    if (this.state.status === 'waiting') {
      waiting = <GameWaiting gameId={this.state.id}/>;
    }

    let board = null;
    if (this.state.status !== 'waiting') {
      board = <GameBoard />;
    }

    return (
      <div className={style['game']}>
        {waiting}
        {board}
      </div>
    );
  },

});
