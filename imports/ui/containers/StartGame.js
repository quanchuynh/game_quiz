import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { QuestionState } from '../../../lib/gCollection';
import './StartGame.css';

class StartGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false
    };
    console.debug("StartGame constructor: " + this.props.gameName);
  }
  
  render() {
    let waitList = this.props.game.waitList, 
        others = this.props.others,
        gameName = this.props.game.name;
    console.debug("Start Game, waitList: " + JSON.stringify(waitList));
    const tempStyle = {position: "relative", top: "70px", 
                       align: "center", textAlign: "left", marginLeft: "auto", marginRight: "auto",
                       width: "60%", fontSize: "18px"
                      };
    console.log("game name: " + gameName);
    return (
      <div style={tempStyle}>
      {
        waitList.length ?
            <div><p>Wait for {waitList.length} players to join <em>{gameName}</em></p>
            <ul className="wait-list">
              { 
                waitList.map((user, i) => <li key={i}>{user}</li>)
              }
            </ul>
            </div>
        :
          <div className="container"> Game Begin ... 
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
  console.log("withTracker Game name: " + gameName);
  var game = CreatedGame.findOne({name: gameName});
  var allPlayers = [game.player1, game.player2];
  allPlayers = game.player3 == null ? allPlayers : [...allPlayers, game.player3 ];
  var otherPlayers = allPlayers.filter(e => e != player);

  console.debug("Start game: " + JSON.stringify(game));
  return {
    game: game,
    gameName: gameName,
    mode: mode,
    player: player,
    others: otherPlayers
  }
}) (StartGame);
