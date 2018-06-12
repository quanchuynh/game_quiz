import React, { Component } from 'react';
import "./FlipCounter.css";

class FlipCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: this.props.initValue
    }
  }

  flipMarkup() {
    let down = this.props.curVal,
        up = down--;
    data = "<span class='count curr top flipTop'>" + down +
           "</span><span class='count next top'>" + up +
           "</span><span class='count next bottom flipBottom'>" + up +
           "</span><span class='count curr bottom'>" + up + "</span>";
    return {__html: data};
  }

  render() {
    return (
      <div className="time row" dangerouslySetInnerHTML={this.flipMarkup()}>
      </div>
    )
  }
}

export default FlipCounter;
