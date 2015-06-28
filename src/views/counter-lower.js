import React from 'react';
import style from './game-board.scss';
import store from '../store/store';
import * as GameActions from '../actions/game';
import InlineSvg from '../components/inline-svg';
import TapButton from '../components/tap-button';

export default React.createClass({

  render() {
    let player = this.props.playerData;
    let containerClass;
    let counter;
    let buttonPlus;
    let buttonMinus;
    let gameOverBtn;
    let restartBtn;

    if (player.get('color') === 'FFFFFF') {
      containerClass = `${style['board__lower']} ${style['board--white']}`;
    } else {
      containerClass = style['board__lower'];
    }

    switch (this.props.stage) {
      case 'rolling':
        counter = player.get('roll');
        break;
      case 'counting':
        buttonPlus = (
          <TapButton className={style['board__life-btn']} onTap={this._increaseLife}>
            <div className={style['board__life-btn-shape']}>
              <InlineSvg className={style['board__life-btn-icon']} name='plus'/>
            </div>
          </TapButton>
        );

        buttonMinus = (
          <TapButton className={style['board__life-btn']} onTap={this._decreaseLife}>
            <div className={style['board__life-btn-shape']}>
              <InlineSvg className={style['board__life-btn-icon']} name='minus'/>
            </div>
          </TapButton>
        );

        counter = player.get('life');
        if (counter <= 0) {
          gameOverBtn = <button className={style['board__game-over-btn']} onClick={this._gameOver}>Game Over</button>;
        }
        break;
      case 'result':
        counter = player.get('result');
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

  _decreaseLife() {
    GameActions.changeLife(-1);
  },

  _increaseLife() {
    GameActions.changeLife(1);
  },

  _gameOver() {
    GameActions.gameOver();
  },

});
