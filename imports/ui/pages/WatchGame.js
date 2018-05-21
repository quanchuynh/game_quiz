import React, { Component } from 'react';
import axios from 'axios';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import SelectInput from '../components/SelectInput';
import './CreateGame.css';

class WatchGame extends Component {
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
     let gameNames = [],
         yes = true, no = false;
     return (
       <div className="gameForm">
          <div className="header">
             <Welcome name={this.props.currentUser.username} />
          </div>
          <form>
             <SelectInput options={gameNames} isRequired={yes} fieldLabel="Game Name"
                optId="gameNameId" placeHolder="Name Of Game To Watch"
             />
             <button id="watch_game" onClick={this.handleSubmit}>Watch Game</button>
          </form>
       </div>
     );
  }
}

export default WatchGame;


