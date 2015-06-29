import React from 'react';
import TapButton from '../components/tap-button';
import InlineSvg from '../components/inline-svg';
import style from './game-board.scss';
import * as UIActions from '../actions/ui';

export default React.createClass({

  render() {
    return (
      <div className={style['board__menu']}>
        <TapButton className={style['board__menu-btn']} onTap={this._showMenu}>
          <InlineSvg className={style['board__menu-btn-icon']} name='menu'/>
        </TapButton>
      </div>
    );
  },

  _showMenu() {
    UIActions.openMenu();
  }

});
