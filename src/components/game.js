import React from 'react';
import GameWaiting from './game-waiting';
import GameBoard from './game-board';
import style from './game.scss';
import store from '../store/store';

export default React.createClass({

  getInitialState() {
    store.register('gameData', data => {
      this.setState(data);
    });
    return store.game;
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
