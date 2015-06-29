import React from 'react';
import TapButton from '../components/tap-button';
import style from './modal-menu.scss';
import * as UIActions from '../actions/ui';
import * as NavActions from '../actions/nav';
import * as GameActions from '../actions/game';

export default React.createClass({

  render() {
    return (
      <div className={style['modal-menu']}>
        <TapButton
          className={style['modal-menu__backdrop']}
          onTap={this._dismiss}></TapButton>

        <ol className={style['modal-menu__content']}>
          <li className={style['modal-menu__item']}>
            <TapButton
              className={style['modal-menu__item-btn']}
              onTap={this._returnHome}>Back to Home</TapButton>
          </li>
          <li className={style['modal-menu__item']}>
            <TapButton
              className={style['modal-menu__item-btn']}
              onTap={this._dismiss}>Resume</TapButton>
          </li>
          <li className={style['modal-menu__item']}>
            <TapButton
              className={style['modal-menu__item-btn']}
              onTap={this._concede}>Concede</TapButton>
          </li>
        </ol>
      </div>
    );
  },

  _dismiss() {
    UIActions.closeMenu();
  },

  _returnHome() {
    NavActions.navTo('/');
  },

  _concede() {
    GameActions.concede();
  },

});
