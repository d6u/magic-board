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

  render() {
    let upperClassName = style['board__upper'];
    let lowerClassName = style['board__lower'];

    lowerClassName += ` ${style['board--white']}`;

    return (
      <div className={style['board']}>
        <div className={upperClassName}>
          <h1 className={style['board__counter']}>{this.state.white_roll}</h1>
        </div>

        <div className={lowerClassName}>
          <h1 className={style['board__counter']}>{this.state.black_roll}</h1>
        </div>
      </div>
    );
  },

});
