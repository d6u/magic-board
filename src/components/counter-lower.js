import React from 'react';
import style from './game-board.scss';
import store from '../store/store';
import * as GameAction from '../view-actions/game';

export default React.createClass({

  render() {
    if (!this.props.playerData) return null;

    let player = this.props.playerData;
    let containerClass;
    let counter;

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
        counter = player.life;
        break;
      default:
        // Do nothing
    }

    return (
      <div className={containerClass}>
        <h1 className={style['board__counter']}>{counter}</h1>
      </div>
    );
  },

});
