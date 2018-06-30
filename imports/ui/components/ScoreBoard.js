import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import FlipCounter from '../components/FlipCounter';
import "./ScoreBoard.css";

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

  renderExpiredNoAnswer() {
     return (
        this.props.countDown < 1 ? 
          <h4 className="float-center" style={{color: "red", textAlign: "center"}}>None got question {currentQuestion}</h4> : <span/>
     )
  }

  render() {
    let userScore = this.props.userScore;
    console.log("userScore: " + userScore.length);
    let scoreLabel = {padding: "5px 10px 0px 10px", /* t, r, b, l */
                      whiteSpace: "pre", 
                      backgroundColor: "#e6f7ff",
                      color: "#005780", borderWidth: "2px", borderStyle: "groove"},
        noPadding = {padding: "0px", marginTop: "4px", width: "25%", float: "left"},
        colors = ["green", "blue"],
        currentQuestion = this.props.currentQuestion;
    return (
        <div>
          <div style={scoreLabel}>
            <span>Question {currentQuestion} of {this.props.questionCount}<br/><br/><br/></span>
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
          </div>
            {
              this.props.currentCorrectAnswerPlayer?
                 <h4 className="float-center attention" style={{textAlign: "center"}}>
                    {this.props.currentCorrectAnswerPlayer} got question {currentQuestion}</h4>
              :
                 this.renderExpiredNoAnswer()
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
  let currentCorrectAnswerPlayer = false;
  var match = TrackCorrectPlayer.find({gameName: gameName, quizId: quizId});
  if (match) { /* possible that no player score yet */
    var correctPlayer = match.fetch();
    for (ii = 0; ii < correctPlayer.length; ii++) {
      if (!correctPlayer[ii].isCorrect) continue;
      let pl = userScore.find((usc) => { return usc.player == correctPlayer[ii].player }
      );
      if (pl) pl.score++;
      else userScore.push({player: correctPlayer[ii].player, score: 1});
      if (correctPlayer[ii].question == currentQuestion - 1) {
        currentCorrectAnswerPlayer = correctPlayer[ii].player;
      }
    }    
  }
  return {
    gameName: gameName,
    quizId: quizId,
    questionCount: questionCount,
    userScore: userScore,
    currentQuestion: currentQuestion,
    currentCorrectAnswerPlayer: currentCorrectAnswerPlayer 
  }
})(ScoreBoard);

