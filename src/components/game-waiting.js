import React from 'react';
import style from './game-waiting.scss';

export default React.createClass({

  render() {

    let digits = this.props.gameId.split('');

    while (digits.length < 4) {
      digits.unshift('0');
    }

    let digitBoxes = digits.map(d => <div className={style['game-id__box']}>{d}</div>);

    return (
      <div className={ style['game-id'] }>
        { digitBoxes }
      </div>
    );
  },

});
