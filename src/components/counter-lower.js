import React from 'react';
import style from './game-board.scss';
import store from '../store/store';
import * as GameAction from '../view-actions/game';
import InlineSvg from './inline-svg';

export default React.createClass({

  render() {
    if (!this.props.playerData) return null;

    let player = this.props.playerData;
    let containerClass;
    let counter;
    let buttonPlus;
    let buttonMinus;
    let gameOverBtn;
    let restartBtn;

    if (player.color === 'FFFFFF') {
      containerClass = `${style['board__lower']} ${style['board--white']}`;
    } else {
      containerClass = style['board__lower'];
    }

    switch (this.props.stage) {
      case 'rolling':
        counter = player.roll;
        break;
      case 'counting':
        buttonPlus = (
          <button className={style['board__life-btn']} onClick={this.increaseLife}>
            <InlineSvg className={style['board__life-btn-icon']} name='plus'/>
          </button>
        );
        buttonMinus = (
          <button className={style['board__life-btn']} onClick={this.decreaseLife}>
            <InlineSvg className={style['board__life-btn-icon']} name='minus'/>
          </button>
        );
        counter = player.life;
        if (player.life <= 0) {
          gameOverBtn = <button className={style['board__game-over-btn']} onClick={this.gameOver}>Game Over</button>;
        }
        break;
      case 'result':
        counter = player.result;
        break;
      default:
        // Do nothing
    }

    return (
      <div className={containerClass} ref='root'>
        {buttonPlus}
        <h1 className={style['board__counter']}>{counter}</h1>
        {buttonMinus}
        {gameOverBtn}
      </div>
    );
  },

  decreaseLife() {
    GameAction.changeLife(-1);
  },

  increaseLife() {
    GameAction.changeLife(1);
  },

  gameOver() {
    GameAction.gameOver();
  },

});
