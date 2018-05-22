import React, { Component } from 'react';
import axios from 'axios';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import FormField from '../components/FormField';
import SelectInput from '../components/SelectInput';
import './CreateGame.css';

nullOrEmpty = function(name) {
  return (!name || name == undefined || name == "" || name.length == 0) ;
};

class CreateGame extends Component {
  constructor(props) {
     super(props);
     this.state = {
        data: '',
        logIn: false,
        players: []
     }
     this.game = { name: '', count: 1, player1: null, player2: null, player3: null};

     this.updateState = this.updateState.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleQuizCountKeyup = this.handleQuizCountKeyup.bind(this);
     this.handleQuizCountSelect = this.handleQuizCountSelect.bind(this);
     this.handleGameName = this.handleGameName.bind(this);
     this.handleQuizPlayer1_Keyup = this.handleQuizPlayer1_Keyup.bind(this); 
     this.handleQuizPlayer1_Select = this.handleQuizPlayer1_Select.bind(this);
     this.handleQuizPlayer2_Keyup = this.handleQuizPlayer2_Keyup.bind(this); 
     this.handleQuizPlayer2_Select = this.handleQuizPlayer2_Select.bind(this);
     this.handleQuizPlayer3_Keyup = this.handleQuizPlayer3_Keyup.bind(this); 
     this.handleQuizPlayer3_Select = this.handleQuizPlayer3_Select.bind(this);
  };

  componentDidMount() {
    Meteor.call('getUsers', '', (err, ret) => {
      this.setState({players: ret});
      console.log("Palyers: " + JSON.stringify(ret));
    });
  }

  handleQuizPlayer1_Keyup(e) {
    console.log("Key up value: " + e.currentTarget.value);
  }

  handleQuizPlayer1_Select(e) {
    var player1 = e.currentTarget.value;
    Meteor.call('checkUserName', player1, (err, ret) => {
      if (!ret) {
        alert('Player 1 "' + player1 + '" has not signed up');
        return;
      }
      this.game.player1 = player1;
    });
  }

  handleQuizPlayer2_Keyup(e) {
  }

  handleQuizPlayer2_Select(e) {
    var player2 = e.currentTarget.value;
    Meteor.call('checkUserName', player2, (err, ret) => {
      if (!ret) {
        alert('Player 2 "' + player2 + '" has not signed up');
        return;
      }
      this.game.player2 = player2;
    });
  }

  handleQuizPlayer3_Keyup(e) {
  }

  handleQuizPlayer3_Select(e) {
    var player3 = e.currentTarget.value;
    Meteor.call('checkUserName', player3, (err, ret) => {
      if (!ret) {
        alert('Player 3 "' + player3 + '" has not signed up');
        return;
      }
      this.game.player3 = player3;
    });
  }

  handleQuizCountKeyup(e) {
    console.debug("Key up value: " + e.currentTarget.value);
  }

  handleQuizCountSelect(e) {
    var parsed = parseInt(e.currentTarget.value);
    if (isNaN(parsed)) {
      alert("Number of quizzes must be a number");
      return;
    }
    if (parsed > 100) {
      alert("Too many quizzes, maximum is 100");
      return;
    }
    this.game.count = parsed;
  }

  handleGameName(e) {
    console.log("Select value: " + e.currentTarget.value);
    let name = e.currentTarget.value;
    if (nullOrEmpty(name)) {
      alert("You must enter a name of this game");
      return;
    }
    Meteor.call('checkGameName', name, (err, ret) => {
      if (ret.found) {
        alert('"' + name + '" already exists, recommended "' + ret.recommend + '"');
        return;
      }
    });
    this.game.name = name;
  }

  updateState(e) {
     this.setState({data: e.target.value});
  }

  handleSubmit() {
    if (!this.nameEnter()) {
      alert("You must enter a name of this game");
      return;
    }
    if (nullOrEmpty(this.game.player1)) {
      alert("Valid signed up user name of player 1 is required");
      return;
    }
    if (nullOrEmpty(this.game.player2)) {
      alert("Valid signed up user name of player 2 is required");
      return;
    }
    if (this.game.player2 == this.game.player1) {
      alert("You must have unique player, 1 and 2 are the same.");
      return;
    }
    if (this.game.player1 == this.game.player3) {
      alert("You must have unique player, 1 and 3 are the same.");
      return;
    }
    if (this.game.player2 == this.game.player3) {
      alert("You must have unique player, 2 and 3 are the same.");
      return;
    }
    window.location.href = joinGamePath;
  }

  nameEnter() {
    return (this.game.name != ""  && this.game.name.length > 0);
  }

  render() {
     let no = false, yes = true,
         opts = [1, 2, 3, 4, 5];
         players = this.state.players;
     return (
       <div className="gameForm">
          <div className="header">
             <Welcome name={this.props.currentUser.username} />
          </div>
          <form>
             <FormField forName="field1" fieldLabel="Name" placeholder="Unique Name Of New Game"
                isRequired={yes} inputType="text" action={this.handleGameName}/>
             <SelectInput options={opts} isRequired={yes} fieldLabel="# of Quizzes" 
                optId="quizCount" placeHolder="Number of quizzes in this game"
                keyUp={this.handleQuizCountKeyup} select={this.handleQuizCountSelect}
                reset={this.state.player1}
             />
             <SelectInput options={players} isRequired={yes} fieldLabel="Player 1" 
                optId="player1" placeHolder="User name of 1st player"
                keyUp={this.handleQuizPlayer1_Keyup} select={this.handleQuizPlayer1_Select}
             />
             <SelectInput options={players} isRequired={yes} fieldLabel="Player 2" 
                optId="player2" placeHolder="User name of 2nd player"
                keyUp={this.handleQuizPlayer2_Keyup} select={this.handleQuizPlayer2_Select}
             />
             <SelectInput options={players} isRequired={no} fieldLabel="Player 3" 
                optId="player3" placeHolder="User name of 3rd player"
                keyUp={this.handleQuizPlayer3_Keyup} select={this.handleQuizPlayer3_Select}
             />
          </form>
          <button id="submit_game" onClick={this.handleSubmit}>Creae Game</button>
       </div>
     );
  }
}

export default CreateGame;
