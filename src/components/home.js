import React from 'react';
import style from './home.scss';

export default React.createClass({

  join() {
    location.hash = '/join';
  },

  newGame() {
    gamesStore.newGame();
  },

  render() {
    return (
      <div className={ style['home'] }>
        <button className={ style['home__button'] } onClick={ this.newGame }>New</button>
        <button className={ style['home__button'] } onClick={ this.join }>Join</button>
      </div>
    );
  },

});
