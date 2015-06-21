import React from 'react';
import style from './game-board.scss';
import store from '../store/store';

export default React.createClass({

  getInitialState() {
    store.register('gameData', data => {
      this.setState(data);
    });
    return store.game;
  },

  upper() {
    if (!store.player) return;

    let containerClass;
    let counter;

    if (store.player.player_id === this.state.player_black) {
      containerClass = `${style['board__upper']} ${style['board--white']}`;
      counter = this.state.white_roll;
    } else {
      containerClass = style['board__upper'];
      counter = this.state.black_roll;
    }

    return (
      <div className={containerClass}>
        <h1 className={style['board__counter']}>{counter}</h1>
      </div>
    );
  },

  lower() {
    if (!store.player) return;

    let containerClass;
    let counter;

    if (store.player.player_id === this.state.player_white) {
      containerClass = `${style['board__lower']} ${style['board--white']}`;
      counter = this.state.white_roll;
    } else {
      containerClass = style['board__lower'];
      counter = this.state.black_roll;
    }

    return (
      <div className={containerClass}>
        <h1 className={style['board__counter']}>{counter}</h1>
      </div>
    );
  },

  render() {
    return (
      <div className={style['board']}>
        {this.upper()}
        {this.lower()}
      </div>
    );
  },

});
