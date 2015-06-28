import React from 'react';
import style from './game-waiting.scss';

export default React.createClass({

  render() {
    let digitBoxes = this.props
      .gameId
      .split('')
      .map((digit, i) => <div className={style['game-id__box']} key={i}>{digit}</div>);

    return (
      <div className={ style['game-id'] }>
        { digitBoxes }
      </div>
    );
  },

});
