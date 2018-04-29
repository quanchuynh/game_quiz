import React, { Component } from 'react';
class Answer extends Component {
  render() {
      let clName= this.props.clName + ' button radius animated zoomIn';
      let buttonLabel = {__html: this.props.copy};
      return (
        <button className={clName} onClick={() => this.props.action(this.props.copy)}
             dangerouslySetInnerHTML={buttonLabel}/> 
      );
    }
}

export default Answer;
