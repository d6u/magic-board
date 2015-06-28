import React from 'react';
import CounterUpper from './counter-upper';
import CounterLower from './counter-lower';
import style from './game-board.scss';
import store from '../store/store';
import * as GameAction from '../actions/game';

export default React.createClass({

  getInitialState() {
    store.register('gameData', data => {
      this.setState(data);
    });
    return store.game;
  },

  players() {
    if (store.player.player_id === this.state.player1.id) {
      return {
        upper: this.state.player2,
        lower: this.state.player1
      };
    } else {
      return {
        upper: this.state.player1,
        lower: this.state.player2
      };
    }
  },

  render() {
    let {upper, lower} = this.players();
    let start = null;

    if (this.state.status === 'rolling' || this.state.status === 'result') {
      start = (
        <button
          className={style['board__start-btn']}
          onClick={this._start}>Start</button>
      );
    }

    return (
      <div className={style['board']}>
        <CounterUpper playerData={upper} stage={this.state.status}/>
        <CounterLower playerData={lower} stage={this.state.status}/>
        {start}
      </div>
    );
  },

  _start() {
    GameAction.start();
  }

});
