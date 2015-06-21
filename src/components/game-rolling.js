import React from 'react';
import style from './game-rolling.scss';

export default React.createClass({

  render() {
    let digitBoxes = this.props.gameId.split('')
      .map( d => <div className={style['game-id__box']}>{d}</div> );

    return (
      <div className={ style['game-id'] }>
        { digitBoxes }
      </div>
    );
  },

});
