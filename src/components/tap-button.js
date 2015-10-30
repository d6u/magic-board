import React from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'hammerjs';
import {isMobile} from '../utils/browser';

/**
 * Mobile touch friendly button
 *
 * Will do browser sniffing to determine to listen to "tap" or "click" event.
 * After trigger event, `onTap` props will called.
 */

export default React.createClass({

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);

    if (isMobile) {
      this.hammertime = new Hammer(el);
      this.hammertime.on('tap', event => this.props.onTap(event));
    }
    else {
      el.addEventListener('click', event => this.props.onTap(event));
    }
  },

  render() {
    return (
      <button
        className={this.props.className}>
        {this.props.children}
      </button>
    );
  },

});
