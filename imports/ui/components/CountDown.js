import React, { Component } from 'react';

class CountDown extends Component {
  constructor(props) {
    this.state = {
      currentCount: this.props.fromSeconds,
    }
  }

  componentDidMount() {
    tInterval = setInterval(() => {
      this.setState({currentCount: this.state.currentCount - 1});
      if (this.state.currentCount <= 0) {
        clearInterval(tInterval);
        this.props.action();
      }
    }, 1000);
  }

  render() {
      <div>{this.props.message} in {this.state.currentCount} seconds </div>
    }
}

export default CountDown;
