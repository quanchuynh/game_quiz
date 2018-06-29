import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import FlipCounter from '../components/FlipCounter';

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: this.props.gameName,
      quizId: this.props.quizId,
      questionCount: this.props.questionCount
    }
  }

  componentDidMount() {
  }

  renderUserScore() {
    let userScore = this.props.userScore;
    console.log("userScore: " + userScore.length);
  }

  render() {
    let userScore = this.props.userScore;
    console.log("userScore: " + userScore.length);
    let scoreLabel = {padding: "5px 10px 0px 10px", /* t, r, b, l */
                      whiteSpace: "pre", 
                      backgroundColor: "#e6f7ff",
                      color: "#005780", borderWidth: "2px", borderStyle: "groove"},
        noPadding = {padding: "0px", marginTop: "4px", width: "25%", float: "left"},
        colors = ["green", "blue"];
    return (
          <div style={scoreLabel}>
            <span>Question {this.props.currentQuestion} of {this.props.questionCount}<br/><br/><br/></span>
            <table style={{color: "#005780"}}>
            <tbody>
              <tr>
              {
                userScore.map((u,i) => (
                  <td style={noPadding} key={i}>{u.player}<FlipCounter initValue={0} curVal={u.score}/> </td>)
                )
              }
              </tr>
            </tbody>
            </table>
            { /*
              this.props.currentCorrectAnswerPlayer?
                 <h5 className="float-center">{this.props.currentCorrectAnswerPlayer} got it</h5>
              :
                 <h5 className="float-center">None got it</h5>
              */
            }
          </div>
    );
  }
}

export default withTracker(({gameName, quizId, questionCount, currentQuestion}) => {
  var userScore = [];
  var game = CreatedGame.findOne({name: gameName});
  if (game) {
    userScore.push({player: game.player1, score: 0});
    userScore.push({player: game.player2, score: 0});
    if (game.playerCount == 3) 
      userScore.push({player: game.player3, score: 0});
  }
  var match = TrackCorrectPlayer.find({gameName: gameName, quizId: quizId});
  if (match) { /* possible that no player score yet */
    var correctPlayer = match.fetch();
    for (ii = 0; ii < correctPlayer.length; ii++) {
      if (!correctPlayer[ii].isCorrect) continue;
      let pl = userScore.find((usc) => { return usc.player == correctPlayer[ii].player }
      );
      if (pl) pl.score++;
      else userScore.push({player: correctPlayer[ii].player, score: 1});
    }    
  }
  let currentCorrectAnswerPlayer = false;
      match = TrackCorrectPlayer.findOne({gameName: gameName, quizId: quizId, question: currentQuestion, isCorrect: true});
      if (match) currentCorrectAnswerPlayer = match.player;
  return {
    gameName: gameName,
    quizId: quizId,
    questionCount: questionCount,
    userScore: userScore,
    currentQuestion: currentQuestion,
    currentCorrectAnswerPlayer: currentCorrectAnswerPlayer 
  }
})(ScoreBoard);

