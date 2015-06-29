import React from 'react';
import TapButton from '../components/tap-button';
import InlineSvg from '../components/inline-svg';
import GameBoardMenu from './game-board-menu';
import style from './game-board.scss';
import store from '../store/store';
import * as GameActions from '../actions/game';
import debounce from 'lodash/function/debounce';

export default React.createClass({

  getInitialState() {

    this._resetTrackLifeChange = debounce(() => {
      this.setState({
        lastLife: null,
        lifeChange: null
      });
    }, 2000);

    return {
      lastLife: null,
      lifeChange: null
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.stage === 'counting') {
      this._trackLifeChange(
        nextProps.playerData.get('life'),
        this.props.playerData.get('life')
      );
    }
  },

  render() {
    let player = this.props.playerData;
    let containerClass;
    let counter;
    let buttonPlus;
    let buttonMinus;
    let gameOverBtn;
    let restartBtn;
    let lifeChangeTracker;

    if (player.get('color') === 'FFFFFF') {
      containerClass = `${style['board__lower']} ${style['board--white']}`;
    } else {
      containerClass = style['board__lower'];
    }

    switch (this.props.stage) {
      case 'rolling':
        counter = player.get('roll');
        break;
      case 'counting':
        buttonPlus = (
          <TapButton className={style['board__life-btn']} onTap={this._increaseLife}>
            <div className={style['board__life-btn-shape']}>
              <InlineSvg className={style['board__life-btn-icon']} name='plus'/>
            </div>
          </TapButton>
        );

        buttonMinus = (
          <TapButton className={style['board__life-btn']} onTap={this._decreaseLife}>
            <div className={style['board__life-btn-shape']}>
              <InlineSvg className={style['board__life-btn-icon']} name='minus'/>
            </div>
          </TapButton>
        );

        counter = player.get('life');
        if (counter <= 0) {
          gameOverBtn = (
            <TapButton
              className={style['board__game-over-btn']}
              onTap={this._gameOver}>Game Over</TapButton>
          );
        }

        if (this.state.lifeChange && this.state.lifeChange !== '0') {
          let sign = this.state.lifeChange > 0 ? '+' : '';
          lifeChangeTracker = (
            <div className={style['board__counter-life-tracker']}>{sign + this.state.lifeChange}</div>
          );
        }

        break;
      case 'result':
        counter = player.get('result');
        break;
      default:
        // Do nothing
    }

    return (
      <div className={containerClass}>
        <GameBoardMenu />
        {buttonPlus}
        <div className={style['board__counter-container']}>
          {lifeChangeTracker}
          <h1 className={style['board__counter']}>{counter}</h1>
        </div>
        {buttonMinus}
        {gameOverBtn}
      </div>
    );
  },

  _decreaseLife() {
    GameActions.changeLife(-1);
  },

  _increaseLife() {
    GameActions.changeLife(1);
  },

  _trackLifeChange(newLife, curLife) {
    if (this.state.lastLife == null) {
      this.setState({
        lastLife: curLife
      });
    }

    this.setState({
      lifeChange: newLife - this.state.lastLife
    });

    this._resetTrackLifeChange();
  },

  _gameOver() {
    GameActions.gameOver();
  },

});
