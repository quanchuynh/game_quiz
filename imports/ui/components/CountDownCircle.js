import React, { Component } from 'react';
import "./CountDownCircle.css";

class CountDownCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startFrom: this.props.fromSeconds
    }
    console.log("Constructor current count: " + this.props.fromSeconds);
  }

  render() {
    let animation = {
        strokeDasharray: "113px",
        strokeDashoffset: "0px",
        strokeLinecap: "round",
        strokeWidth: "3px",
        stroke: this.props.color,
        fill: "none",
        animation: "countdown " + this.props.fromSeconds + "s linear infinite forwards" 
      };

    return (
      <div className="count-down-circle">
        <svg>
          <circle r="18" cx="20" cy="20" style={animation}></circle>
        </svg>
        <div className="countdown-circle-number">{this.props.countDown}</div>
      </div>
    )
  }
}

export default CountDownCircle;
