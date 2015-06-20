import React from 'react';
import router from '../store/route';
import { games } from '../store/games';
import joinStyle from './game.scss';

export default React.createClass({

  getInitialState() {
    return { isWaiting: true };
  },

  componentDidMount() {
    router.register('/:id', event => {
      if (/^\d+$/.test(event.id)) {
        if (event.type === 'enter') {
          this.gameId = event.id;
          this.game = games.child(event.id);
          this.gameChangeCallback = ss => this.gameChanged(ss.val());
          this.game.on('value', this.gameChangeCallback);
        }
      }
    });
  },

  componentWillUnmount() {
    console.log('123');
    this.game.off('value', this.gameChangeCallback);
  },

  gameChanged(detail) {
    if (!detail) {
      this.game.set({
        status: 'waiting'
      });
    }
    else {
      switch (detail.status) {
        case 'waiting':
          this.setState({
            isWaiting: true,
            gameId: this.gameId
          });
          break;
        case 'gaming':
          break;
        default:
          // Do nothing
      }
    }
  },

  render() {
    return (
      <div className={ pageStyle['page__inner'] }>
        { this.state.gameId }
      </div>
    );
  },

});
