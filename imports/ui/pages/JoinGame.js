import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import SelectInput from '../components/SelectInput';
import StartGame from '../containers/StartGame';
import { withTracker } from 'meteor/react-meteor-data';
import './CreateGame.css';

/* props: this.props.currentUser.username */
nullOrEmpty = function(name) {
  return (!name || name == undefined || name == "" || name.length == 0) ;
};

class JoinGame extends Component {
  constructor(props) {
     super(props);
     this.state = {
        data: '',
        games: [],
        gameName: this.props.gameJoined 
     }
     this.updateState = this.updateState.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleKeyup = this.handleKeyup.bind(this);
     this.handleSelect = this.handleSelect.bind(this);
     this.handleDisjoin = this.handleDisjoin.bind(this);
     this.gameName = '';
  };

  handleKeyup(e) {
  }

  componentDidMount() {
    console.debug("Game Joined, componentDidMount " + this.props.gameJoined);
    if (this.props.gameJoined) {
      this.gameName = this.props.gameJoined;
      this.setState({gameName: this.gameName, start: true});
      return;
    }
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

  handleDisjoin() {
    console.debug("JoinGame, handleDisjoin");
    this.setState({start: false});
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
          if (ret.errorType && ret.errorType == 'joined') { 
            this.setState({gameName: this.gameName, start: true});
          }
          return;
        }
        console.debug("Join Game, handleSubmit, succeeded");
        this.setState({gameName: this.gameName, start: true});
      });
    });
  }

  render() {
     let gameNames = this.props.games,
         yes = true, no = false;
     return (
       this.state.start ?
         <StartGame gameName={this.state.gameName} mode='play' player={this.props.currentUser.username} disjoin={this.handleDisjoin}/>
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

export default withTracker( ({currentUser}) => {
  /* Make the game name reactive. So new names are available w/o refresh. */
  var gameNames = [];
  let userName = currentUser.username, gameJoined = null;
  var orCodintion = {$or: [{player1: userName}, {player2: userName}, {player3: userName}]};
  var condition = {$and: [{active: true}, orCodintion]};
  match = CreatedGame.find(condition);
  if (match) {
    var matches = match.fetch();
    for (ii = 0; ii < matches.length; ii++) {
      gameNames[ii] = matches[ii].name;
      var waitList = matches[ii].waitList;
      if (!waitList.includes(userName)) {
        gameJoined = matches[ii].name;
      }
    }
  }

  return {
    currentUser: currentUser,
    games: gameNames,
    gameJoined: gameJoined
  }
})(JoinGame);
