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
    let waitList = this.props.game.waitList, others = this.props.game.waitList;
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
          <div> Game Begin ... 
            <ul>
              { 
                waitList.map((user, i) => <li key={i}> {user}</li>)
              }
            </ul>
          </div>
      }
      </div>
    );
  } 
}

export default withTracker(({gameName, mode, player}) => {
  console.debug("withTracker Game name: " + gameName);
  var game = CreatedGame.findOne({name: gameName});
  var allPlayers = [game.player1, game.player2];
  allPlayers = game.player3 == null ? allPlayers : [...allPlayers, game.player3 ];
  var otherPlayers = allPlayers.filter(e => e != player);

  console.debug("Start game: " + JSON.stringify(game));
  return {
    game: game,
    mode: mode,
    player: player,
    others: otherPlayers
  }
}) (StartGame);
