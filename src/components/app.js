import React from 'react';
import style from './app.scss';
import { games, allGames } from '../store/games';
import { sharedRegistry } from '../store/route';

function randomId() {
  return Math.floor(Math.random() * 10000);
}

export default React.createClass({

  async newGame(event) {
    // let id;
    // let all;
    // do {
    //   id = randomId();
    //   all = await allGames();
    // } while (all && all[id]);

    // games.child(id).set({
    //   status: 'waiting'
    // });
  },

  componentDidMount() {
    sharedRegistry.register('/items/:id/:thing', (m) => console.log(m));
  },

  render() {
    return <div className={ style['start-button'] } onClick={ this.newGame }>New Game</div>;
  },

});
