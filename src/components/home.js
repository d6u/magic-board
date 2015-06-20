import pageStyle from './page.scss';
import homeStyle from './home.scss';
import React from 'react';

export default React.createClass({

  join() {
    location.hash = '/join';
  },

  render() {
    return (
      <div className={ pageStyle['page__inner'] }>
        <button className={ homeStyle['start-button'] }>New</button>
        <button className={ homeStyle['start-button'] } onClick={ this.join }>Join</button>
      </div>
    );
  },

});
