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
    let waiting = <GameWaiting gameId={this.state.id}/>;
    let board = <GameBoard />;

    return (
      <div className={style['game']}>
        {this.state.status === 'waiting' ? waiting : null}
        {this.state.status !== 'waiting' ? board : null}
      </div>
    );
  },

});
