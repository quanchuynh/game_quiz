import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { QuestionState } from '../../../lib/gCollection';

gameName = '';

class StartGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false
    };
    console.debug("StartGame constructor: " + this.props.gameName);
  }
  
  render() {
    let waitList = this.props.game.waitList;
    console.debug("Start Game, waitList: " + JSON.stringify(waitList));
    const tempStyle = {position: "relative", top: "100px", float: "center"};
    return (
      <div style={tempStyle}>
      {
        waitList.length ?
            <div> Wait for {waitList.length} players to join 
            <ul>
              { 
                waitList.map((user, i) => <li key={i}> {user}</li>)
              }
            </ul>
            </div>
        :
          <div> Game Begin ... </div>
      }
      </div>
    );
  } 
}

export default withTracker(({gameName}) => {
  console.debug("withTracker Game name: " + gameName);
  var game = CreatedGame.findOne({name: gameName});
  console.debug("Start game: " + JSON.stringify(game));
  return {
    game: game
  }
}) (StartGame);
