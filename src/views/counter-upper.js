import React from 'react';
import style from './game-board.scss';

export default React.createClass({

  render() {
    let player = this.props.playerData;
    let containerClass;
    let counter;

    if (player.get('color') === 'FFFFFF') {
      containerClass = `${style['board__upper']} ${style['board--white']}`;
    } else {
      containerClass = style['board__upper'];
    }

    switch (this.props.stage) {
      case 'rolling':
        counter = player.get('roll');
        break;
      case 'counting':
        counter = player.get('life');
        break;
      case 'result':
        counter = player.get('result');
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
