import React, { Component } from 'react';
class Button extends Component {
  render() {
      let clName= this.props.clName + ' button radius animated zoomIn';
      if (this.props.disable)
        return (
          <button className={clName} disabled> {this.props.copy} </button>
        );
      else
        return (
          <button className={clName} onClick={() => this.props.action(this.props.copy)}> {this.props.copy} </button>
        );
    }
}

export default Button;
