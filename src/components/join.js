import React from 'react';
import pageStyle from './page.scss';
import joinStyle from './join.scss';

export default React.createClass({

  getInitialState() {
    return { vals: [] };
  },

  input() {
    return React.findDOMNode(this.refs.input);
  },

  inputChanged() {
    let input = this.input();
    let vals = input.value.split('');
    this.setState({ vals });
  },

  boxTapped() {
    this.input().focus();
  },

  render() {
    return (
      <div className={ `${pageStyle['page__inner']} ${joinStyle['join-page']}` }>
        <input type='text' pattern='[0-9]*' className={ joinStyle['join-input'] } ref='input' onChange={ this.inputChanged }/>
        <div className={ joinStyle['join-page__box'] } onClick={ this.boxTapped }>{ this.state.vals[0] }</div>
        <div className={ joinStyle['join-page__box'] } onClick={ this.boxTapped }>{ this.state.vals[1] }</div>
        <div className={ joinStyle['join-page__box'] } onClick={ this.boxTapped }>{ this.state.vals[2] }</div>
        <div className={ joinStyle['join-page__box'] } onClick={ this.boxTapped }>{ this.state.vals[3] }</div>
      </div>
    );
  },

});
