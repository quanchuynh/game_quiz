import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { QuestionState } from '../../../lib/gCollection';
import CountDown from '../components/CountDown';
import Practice from '../pages/Practice';
import './StartGame.css';

class StartGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false
    };
    console.debug("StartGame constructor: " + this.props.gameName);
    this.handleTimeExpire = this.handleTimeExpire.bind(this);
  }

  handleTimeExpire() {
  }
  
  render() {
    let waitList = this.props.game.waitList, 
        others = this.props.others,
        countDown = this.props.game.countDown,
        gameName = this.props.game.name,
        countDownMessage = "Game will start in " + this.props.game.countDown + " seconds";
    console.debug("Start Game, waitList: " + JSON.stringify(waitList));
    const yes = true, no = false;
    const tempStyle = {position: "relative", top: "70px", 
                       align: "center", textAlign: "left", marginLeft: "auto", marginRight: "auto",
                       width: "auto", fontSize: "18px"
                      };
    console.log("game name: " + gameName);
    return (
      <div style={tempStyle}>
      {
        waitList.length ?
            <div><p>Wait for {waitList.length} players to join game <em>{gameName}</em></p>
            <ul className="wait-list">
              { 
                waitList.map((user, i) => <li key={i}>{user}</li>)
              }
            </ul>
            </div>
        :
          <span>
          {
            countDown > 0 ?
              <div className="container"> {countDownMessage} </div>
            :
              <Practice gameMode={yes} gameName={gameName} 
                        categorySelector={this.props.game.categorySelector} 
                        player={this.props.player}
                        quizId={this.props.game.currentQuizId}
                        watchMode={this.props.mode}
              />
          }
          </span>
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
    mode: mode, /* watch or play */
    player: player,
    others: otherPlayers
  }
}) (StartGame);
