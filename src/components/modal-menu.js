import React from 'react';
import TapButton from '../components/tap-button';
import style from './modal-menu.scss';
import * as UIActions from '../actions/ui';

/**
 * Mobile touch friendly button
 *
 * Will do browser sniffing to determine to listen to "tap" or "click" event.
 * After trigger event, `onTap` props will called.
 */

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
              className={style['modal-menu__item-btn']}>Back to Home</TapButton>
          </li>
          <li className={style['modal-menu__item']}>
            <TapButton
              className={style['modal-menu__item-btn']}
              onTap={this._dismiss}>Resume</TapButton>
          </li>
          <li className={style['modal-menu__item']}>
            <TapButton
              className={style['modal-menu__item-btn']}>Concede</TapButton>
          </li>
        </ol>
      </div>
    );
  },

  _dismiss() {
    UIActions.closeMenu();
  }

});
