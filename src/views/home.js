import React from 'react';
import TapButton from '../components/tap-button';
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
        <TapButton
          className={style['home__button']}
          onTap={this.newGame}>New</TapButton>
        <TapButton
          className={style['home__button']}
          onTap={this.join}>Join</TapButton>
      </div>
    );
  },

});
