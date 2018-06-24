import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';

class ChangePassword extends Component {
  constructor(props) {
     super(props);
     this.state = {
        data: '',
        logIn: false
     }
     this.updateState = this.updateState.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
  };

  updateState(e) {
     this.setState({data: e.target.value});
  }

  handleSubmit() {
     console.debug("New game: " + this.state.data);
     window.location.href = "/add-player";
  }

  render() {
     let currentUser = Meteor.user();
     let componentName = getComponentAfterLogin();
     console.log("currentUser: " + Meteor.user());
     return (
       <div>
          <div>
             <Blaze template="change_password" />
          </div>
       </div>
     );
  }
}

export default ChangePassword;
