import React from 'react';
import style from './join.scss';

export default React.createClass({

  getInitialState() {
    return { value: '' };
  },

  input() {
    return React.findDOMNode(this.refs.input);
  },

  inputChanged() {
    let input = this.input();

    if (input.value.length === 4) {
      gamesStore.hasGame(input.value)
        .then(has => {
          if (has) {
            location.hash = `/game/${input.value}`;
          } else {
            alert('No game found!');
          }
        });
    }

    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }

    this.setState({ value: input.value });
  },

  boxTapped() {
    this.input().focus();
  },

  back() {
    location.hash = '/';
  },

  render() {
    let boxes = [0, 1, 2, 3].map( n => {
      return (
        <div className={ style['join__box'] } onClick={ this.boxTapped } key={ n }>
          { this.state.value[n] }
        </div>
      );
    });

    return (
      <div className={ style['join'] }>
        <input type='text' pattern='[0-9]*' className={ style['hidden-input'] } ref='input' onChange={ this.inputChanged } />
        <div className={ style['join__boxes'] }>
          { boxes }
        </div>
        <button className={ style['join__back'] } onClick={ this.back }>back</button>
      </div>
    );
  },

});
