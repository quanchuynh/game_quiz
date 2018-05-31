import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

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

  render() {
    let userScore = this.props.userScore;
    return (
      <div> <span>Question {this.props.currentQuestion} of {this.props.questionCount} </span>
            "SCORES: "
            userScore.map((user, i) => ( <span key={i}>{user.player}: {user.score}</span> ) )
      </div>
      
    );
  }
}

export default withTracker(({gameName, quizId, questionCount}) => {
  var userScore = [];
  var match = TrackCorrectPlayer.find({gameName: gameName, quizId: quizId});
  if (match) { /* possible that no player score yet */
    var correctPlayer = match.fetch();
    for (ii = 0; ii < correctPlayer.length; ii++) {
      let pl = userScore.find((usc) => { return usc.player == correctPlayer[ii].player});
      if (pl) pl.score++;
      else userScore.push({player: correctPlayer[ii].player, score: 1});
    }    
  }
  return {
    gameName: gameName,
    quizId: quizId,
    questionCount: questionCount
  }
})(ScoreBoard);

