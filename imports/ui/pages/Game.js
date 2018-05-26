import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';

class Game extends Component {
  /* Switch case for drop down menu under Game tab. */
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
  
     return (
       <div>
          <div>
             <Blaze template="signupLogin" component={componentName}/>
          </div>
       </div>
     );
  }
}

export default Game;
