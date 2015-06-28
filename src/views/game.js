import React from 'react';
import GameWaiting from './game-waiting';
import GameBoard from './game-board';
import style from './game.scss';
import store from '../store/store';

export default React.createClass({

  getInitialState() {
    store.register('gameData', game => {
      this.setState({game});
    });
    return {game: store.game};
  },

  render() {
    let game = this.state.game;
    let waiting = null;
    let board = null;

    if (game.get('status') === 'waiting') {
      waiting = <GameWaiting gameId={this.props.game.get('game_id')}/>;
    }

    if (game.get('status') !== 'waiting') {
      board = <GameBoard />;
    }

    return (
      <div className={style['game']}>
        {waiting}
        {board}
      </div>
    );
  },

});
