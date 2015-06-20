import router from '../store/route';
import React from 'react';
import Home from './home';
import Join from './join';
import pageStyle from './page.scss';

function randomId() {
  return Math.floor(Math.random() * 10000);
}

export default React.createClass({

  getInitialState() {
    return {
      home: false,
      game: false,
      join: false,
    };
  },

  componentDidMount() {
    router.register('/', event => {
      if (event.type === 'enter') {
        this.setState({
          home: true,
          game: false,
          join: false,
        });
      }
    });

    router.register('/:id', event => {
      if (event.type === 'enter') {
        if (event.id === 'join') {
          this.setState({
            home: false,
            game: false,
            join: true,
          });
        }
        else {
          this.setState({
            home: false,
            game: true,
            join: false,
          });
        }
      }
    });
  },

  render() {
    let home = this.state.home ? <Home /> : null;
    let join = this.state.join ? <Join /> : null;

    return (
      <div className={ pageStyle['page'] }>
        { home }
        { join }
      </div>
    );
  },

});
