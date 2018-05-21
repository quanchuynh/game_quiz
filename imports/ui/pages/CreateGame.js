import React, { Component } from 'react';
import axios from 'axios';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Meteor } from 'meteor/meteor';
import Welcome from '../components/Welcome';
import FormField from '../components/FormField';
import SelectInput from '../components/SelectInput';
import './CreateGame.css';

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
     let no = false, yes = true,
         opts = [1, 2, 3, 4, 5];
         players = [];
     return (
       <div className="gameForm">
          <div className="header">
             <Welcome name={this.props.currentUser.username} />
          </div>
          <form>
             <FormField forName="field1" fieldLabel="Name" placeholder="Unique Name Of New Game"
                isRequired={yes} inputType="text" action={this.updateState}/>
             <SelectInput options={opts} isRequired={yes} fieldLabel="# of Quizzes" 
                optId="quizCount" placeHolder="Number of quizzes in this game"
             />
             <SelectInput options={players} isRequired={yes} fieldLabel="Player 1" 
                optId="player1" placeHolder="User name of 1st player"
             />
             <SelectInput options={players} isRequired={yes} fieldLabel="Player 2" 
                optId="player2" placeHolder="User name of 2nd player"
             />
             <SelectInput options={players} isRequired={no} fieldLabel="Player 3" 
                optId="player3" placeHolder="User name of 3rd player"
             />
             <button id="submit_game" onClick={this.handleSubmit}>Creae Game</button>
             <h4>{this.state.data}</h4>
          </form>
       </div>
     );
  }
}

export default CreateGame;
