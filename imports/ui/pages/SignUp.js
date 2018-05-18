import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

class SignUp extends Component {
  constructor(props) {
     super(props);
     this.state = {
        logIn: false
     }
     this.handleSubmit = this.handleSubmit.bind(this);
  };

  updateState(e) {
     this.setState({data: e.target.value});
  }

  handleSubmit() {
     console.log("New game: " + this.state.data);
     window.location.href = "/add-player";
  }

  render() {
     return (
        <div>
           <Blaze template="signup"/>
        </div>
     );
  }
}

export default SignUp;
