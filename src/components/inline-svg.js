import React from 'react';

export default React.createClass({

  render() {
    let svg = require(`../img/${this.props.name}.svg`);
    return (
      <div
        className={this.props.className}
        dangerouslySetInnerHTML={{__html: svg}}></div>
    );
  },

});
