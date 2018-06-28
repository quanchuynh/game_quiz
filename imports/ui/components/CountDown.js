import React, { Component } from 'react';

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: this.props.fromSeconds
    }
    console.debug("Constructor current count: " + this.props.fromSeconds);
  }

  componentDidMount() {
    console.debug("Current count: " + this.state.currentCount + ", props: " + this.props.fromSeconds);
    tInterval = setInterval(() => {
      this.setState({currentCount: this.state.currentCount - 1});
      if (this.state.currentCount <= 0) {
        clearInterval(tInterval);
        this.props.action();
      }
    }, 1000);
  }

  render() {
    console.debug("Current count: " + this.state.currentCount);
    return (
      <div>{this.props.message} in {this.state.currentCount} seconds </div>
    );
  }
}

export default CountDown;
