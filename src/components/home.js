import React from 'react';
import style from './home.scss';
import * as NavAction from '../view-actions/nav';
import {navTo} from '../util/nav';

export default React.createClass({

  join() {
    navTo('/join');
  },

  newGame() {
    NavAction.newGame();
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
