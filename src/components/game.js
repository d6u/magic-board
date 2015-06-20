import React from 'react';
import router from '../store/route';
import gamesStore from '../store/games';
import GameWaiting from './game-waiting';
import style from './game.scss';

export default React.createClass({

  getInitialState() {
    return {
      status: '',
      id: null,
    };
  },

  componentDidMount() {
    router.register('/game/:id', event => {
      if (event.type === 'enter') {
        gamesStore.joinGame(event.id);
        this.setState({
          id: event.id
        });
        this.registerGameChangeHandlers();
      }
    });
  },

  registerGameChangeHandlers() {
    gamesStore.game.on('value', ss => {
      let g = ss.val();
      this.setState(g);
    });
  },

  render() {

    let waiting = this.state.status === 'waiting' ? <GameWaiting gameId={this.state.id} /> : null;

    return (
      <div className={ style['game'] }>
        { waiting }
      </div>
    );
  },

});
