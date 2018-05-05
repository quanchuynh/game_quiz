import React, { Component } from 'react';
class Button extends Component {
  render() {
      let clName= this.props.clName + ' button radius animated zoomIn';
      let buttonLabel = {__html: this.props.copy.replace(/AND/g, '&').replace(/_/g, ' ')};
      let noWrap = {whiteSpace: "nowrap"};
      if (this.props.disable)
        return (
          <button className={clName} dangerouslySetInnerHTML={buttonLabel} disabled/>
        );
      else
        return (
          <button className={clName} onClick={() => this.props.action(this.props.copy)}
             dangerouslySetInnerHTML={buttonLabel} style={noWrap}/> 
        );
    }
}

export default Button;
