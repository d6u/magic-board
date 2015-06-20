import React from 'react';
import style from './game-waiting.scss';

export default React.createClass({

  render() {
    return (
      <h1 className={ style['game-waiting'] }>
        { this.props.gameId }
      </h1>
    );
  },

});
