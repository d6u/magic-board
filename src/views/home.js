import React from 'react';
import style from './home.scss';
import * as GameActions from '../actions/game';
import * as NavActions from '../actions/nav';

export default React.createClass({

  join() {
    NavActions.navTo('/join');
  },

  newGame() {
    GameActions.newGame();
  },

  render() {
    return (
      <div className={style['home']}>
        <button
          className={style['home__button']}
          onClick={this.newGame}>New</button>
        <button
          className={style['home__button']}
          onClick={this.join}>Join</button>
      </div>
    );
  },

});
