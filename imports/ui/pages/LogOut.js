import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';

class LogOut extends Component {
  constructor(props) {
     super(props);
  };

  componentDidMount() {
    Meteor.logout();
    // window.location.href = PracticePath;
  }

  render() {
     let currentUser = Meteor.user();
     return (
       <div>
          <div>
             <Blaze template="logout" />
          </div>
       </div>
     );
  }
}

export default LogOut;
