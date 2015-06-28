import React from 'react';
import style from './join.scss';
import * as NavActions from '../actions/nav';
import * as GameActions from '../actions/game';

export default React.createClass({

  getInitialState() {
    return {value: ''};
  },

  render() {
    let boxes = [];
    for (let i = 0; i < 4; i++) {
      boxes.push(
        <div className={style['join__box']} onClick={this.boxTapped} key={i}>
          {this.state.value[i]}
        </div>
      );
    }

    return (
      <div className={style['join']}>
        <input
          type='text'
          pattern='[0-9]*'
          className={style['hidden-input']}
          ref='input'
          onChange={this.inputChanged}/>

        <div className={style['join__boxes']}>{boxes}</div>

        <button
          className={style['join__back']}
          onClick={this.back}>back</button>
      </div>
    );
  },

  input() {
    return React.findDOMNode(this.refs.input);
  },

  inputChanged() {
    let input = this.input();

    if (input.value.length === 4) {
      GameActions.joinGame(input.value)
        .catch(function (err) {
          alert(err.message);
        });
    } else if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }

    this.setState({value: input.value});
  },

  boxTapped() {
    this.input().focus();
  },

  back() {
    NavActions.navTo('/');
  },

});
