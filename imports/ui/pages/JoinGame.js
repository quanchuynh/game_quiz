import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import SelectInput from '../components/SelectInput';
import StartGame from '../containers/StartGame';
import './CreateGame.css';

nullOrEmpty = function(name) {
  return (!name || name == undefined || name == "" || name.length == 0) ;
};

class JoinGame extends Component {
  constructor(props) {
     super(props);
     this.state = {
        data: '',
        games: [],
        gameName: ''
     }
     this.updateState = this.updateState.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleKeyup = this.handleKeyup.bind(this);
     this.handleSelect = this.handleSelect.bind(this);
     this.gameName = '';
  };

  handleKeyup(e) {
  }

  componentDidMount() {
    console.debug("Join Game, componentDidMount ");
    this.setState({start: false});
  }

  handleSelect(e) {
    var name = e.target.value;
    if (nullOrEmpty(name)) return;
    let userName = this.props.currentUser.username;
    console.debug("Join game, Handle select: ");
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
    console.debug("Join Game, handleSubmit, game: " + this.state.gameName);
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
      Meteor.call('joinGame', this.gameName, userName, (err, ret) => {
        if (!ret.ok) {
          alert(ret.errorMessage);
          return;
        }
        console.debug("Join Game, handleSubmit, succeeded");
        this.setState({gameName: this.gameName, start: true});
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
       this.state.start ?
         <StartGame gameName={this.state.gameName} mode='play' player='this.props.currentUser.username'/>
       :
         <div className="gameForm">
            <div className="header">
               <Welcome name={this.props.currentUser.username} />
            </div>
            <form>
               <SelectInput options={gameNames} isRequired={yes} fieldLabel="Game Name"
                  optId="gameNameId" placeHolder="Name Of Game To Join"
                  keyUp={this.handleKeyup} select={this.handleSelect}
               />
            </form>
            <button id="join_game" onClick={this.handleSubmit}>Join Game</button>
         </div>
     );
  }
}

export default JoinGame;
