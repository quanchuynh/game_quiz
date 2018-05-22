import React, { Component } from 'react';
import axios from 'axios';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import SelectInput from '../components/SelectInput';
import './CreateGame.css';

nullOrEmpty = function(name) {
  return (!name || name == undefined || name == "" || name.length == 0) ;
};

class JoinGame extends Component {
  constructor(props) {
     super(props);
     this.state = {
        data: '',
        games: []
     }
     this.updateState = this.updateState.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleKeyup = this.handleKeyup.bind(this);
     this.handleSelect = this.handleSelect.bind(this);
     this.gameName = '';
  };

  handleKeyup(e) {
  }

  handleSelect(e) {
    var name = e.target.value;
    if (nullOrEmpty(name)) return;
    let userName = this.props.currentUser.username;
    Meteor.call('checkGame', name, userName, (err, ret) => {
      if (!ret) {
        alert('Game "' + name + ' is not created yet. Create it first.');
        return;
      }
      if (!ret.ok) {
        alert(ret.errorMessage);
        return;
      }
      this.gameName = name;
    });
  }

  updateState(e) {
    this.setState({data: e.target.value});
  }

  handleSubmit() {
    console.log("New game: " + this.state.data);
    let userName = this.props.currentUser.username;
    Meteor.call('checkGame', this.gameName, userName, (err, ret) => {
      if (!ret) {
        alert('Game "' + name + ' is not created yet. Create it first.');
        return;
      }
      if (!ret.ok) {
        alert(ret.errorMessage);
        return;
      }
      /* Begin game here. */
      Meteor.call('joinGame', this.gameName, userName, (err, ret) => {
        if (!ret.ok) {
          alert(ret.errorMessage);
          return;
        }
      });
    });
  }

  componentDidMount() {
    let userName = this.props.currentUser.username;
    Meteor.call('getMatchGames', userName, (err, ret) => {
      this.setState({games: ret});
    });
  }

  render() {
     let gameNames = this.state.games,
         yes = true, no = false;
     return (
       <div className="gameForm">
          <div className="header">
             <Welcome name={this.props.currentUser.username} />
          </div>
          <form>
             <SelectInput options={gameNames} isRequired={yes} fieldLabel="Game Name"
                optId="gameNameId" placeHolder="Name Of Game To Join"
                keyUp={this.handleKeyup} select={this.handleSelect}
             />
             <button id="join_game" onClick={this.handleSubmit}>Join Game</button>
          </form>
       </div>
     );
  }
}

export default JoinGame;
