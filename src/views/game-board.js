import React from 'react';
import TapButton from '../components/tap-button';
import CounterUpper from './counter-upper';
import CounterLower from './counter-lower';
import style from './game-board.scss';
import store from '../store/store';
import * as GameAction from '../actions/game';

export default React.createClass({

  getInitialState() {
    store.register('gameData', game => {
      this.setState({game});
    });
    return {game: store.game};
  },

  players() {
    if (store.player.get('player_id') === this.state.game.getIn(['player1', 'id'])) {
      return {
        upper: this.state.game.get('player2'),
        lower: this.state.game.get('player1')
      };
    } else {
      return {
        upper: this.state.game.get('player1'),
        lower: this.state.game.get('player2')
      };
    }
  },

  render() {
    let {upper, lower} = this.players();
    let start = null;

    if (this.state.game.get('status') === 'rolling' ||
        this.state.game.get('status') === 'result')
    {
      start = (
        <TapButton
          className={style['board__start-btn']}
          onTap={this._start}>Start</TapButton>
      );
    }

    return (
      <div className={style['board']}>
        <CounterUpper playerData={upper} stage={this.state.game.get('status')}/>
        <CounterLower playerData={lower} stage={this.state.game.get('status')}/>
        {start}
      </div>
    );
  },

  _start() {
    GameAction.start();
  }

});
