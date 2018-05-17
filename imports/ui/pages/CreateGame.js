import React, { Component } from 'react';
import axios from 'axios';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';

class CreateGame extends Component {
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
     console.log("New game: " + this.state.data);
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
          <div>
             <h4>Welcome: {currentUser}</h4>
             <h4>Enter a Unique Name For Your New Game</h4>
             <input type = "text" value = {this.state.data} onChange={this.updateState}/>
             <button onClick={this.handleSubmit}>Submit</button>
             <h4>{this.state.data}</h4>
          </div>
       </div>
     );
  }
}

export default CreateGame;
