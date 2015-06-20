import React from 'react';
import { newGame } from '../store/games';
import style from './home.scss';

export default React.createClass({

  join() {
    location.hash = '/join';
  },

  async newGame() {
    let id = await newGame();
    location.hash = `/game/${id}`;
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
