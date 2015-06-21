import React       from 'react';
import GameWaiting from './game-waiting';
import style       from './game.scss';
import store from '../store/store';

export default React.createClass({

  getInitialState() {
    store.register('gameData', data => {
      this.setState(data);
    });
    return store.game;
  },

  render() {
    let waiting = this.state.status === 'waiting' ? <GameWaiting gameId={this.state.id}/> : null;
    return (
      <div className={style['game']}>
        {waiting}
      </div>
    );
  },

});
