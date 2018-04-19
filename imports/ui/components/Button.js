import React, { Component } from 'react';
class Button extends Component {
  render() {
      let clName= this.props.clName + ' button radius animated zoomIn';
      return (
        <button className={clName} onClick={() => this.props.action(this.props.copy)}>{this.props.copy}</button>
      );
    }
}

export default Button;
