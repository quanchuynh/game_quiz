import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import SelectInput from '../components/SelectInput';
import StartGame from '../containers/StartGame';
import { withTracker } from 'meteor/react-meteor-data';
import './CreateGame.css';

class WatchGame extends Component {
  constructor(props) {
     super(props);
     this.state = {
        data: '',
        logIn: false,
        games: [],
        start: false,
        gameToWatch: ''
     }
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleKeyup = this.handleKeyup.bind(this);
     this.handleSelect = this.handleSelect.bind(this);
  };

  handleKeyup(e) {
  }

  handleSelect(e) {
    this.setState({gameToWatch: e.target.value});
  }

  handleSubmit(e) {
    this.setState({start: true});
  }

  componentDidMount() {
    let userName = this.props.currentUser.username;
    Meteor.call('getActiveGames', (err, ret) => {
      console.log('getActiveGames: ' + JSON.stringify(ret));
      this.setState({games: ret});
    });
  }

  render() {
     let gameNames = this.props.games,
         yes = true, no = false,
         start = this.state.start;
     return (
       start ? 
         <StartGame gameName={this.state.gameToWatch} mode='watch' 
                    player={this.props.currentUser.username}/>
       :
         <div className="gameForm">
            <div className="header">
               <Welcome name={this.props.currentUser.username} />
            </div>
            <form>
               <SelectInput options={gameNames} isRequired={yes} fieldLabel="Game Name"
                  optId="gameNameId" placeHolder="Name Of Game To Watch"
                  keyUp={this.handleKeyup} select={this.handleSelect}
               />
            </form>
            <button id="watch_game" onClick={this.handleSubmit}>Watch Game</button>
         </div>
     );
  }
}

export default withTracker( ({currentUser}) => {
  /* Make the game name reactive. So new names are available w/o refresh. */
  var gameNames = [];
  let userName = currentUser.username;
  match = CreatedGame.find();
  if (match) {
    var matches = match.fetch();
    for (ii = 0; ii < matches.length; ii++) {
      gameNames[ii] = matches[ii].name;
    }
  }

  return {
    currentUser: currentUser,
    games: gameNames
  }
})(WatchGame);
