import React from 'react';
import pageStyle from './page.scss';
import joinStyle from './join.scss';

export default React.createClass({

  getInitialState() {
    return { value: '' };
  },

  input() {
    return React.findDOMNode(this.refs.input);
  },

  inputChanged() {
    let input = this.input();
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
    this.setState({ value: input.value });
  },

  boxTapped() {
    this.input().focus();
  },

  render() {
    let boxes = [0, 1, 2, 4].map( n => {
      return (
        <div
          className={ joinStyle['join-page__box'] }
          onClick={ this.boxTapped }
          key={ n }>
          { this.state.value[n] }
        </div>
      );
    })
    return (
      <div className={ `${pageStyle['page__inner']} ${joinStyle['join-page']}` }>
        <input
          type='text'
          pattern='[0-9]*'
          className={ joinStyle['join-page__input'] }
          ref='input'
          onChange={ this.inputChanged } />
        { boxes }
      </div>
    );
  },

});
