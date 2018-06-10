import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class SelectCategoryCountDown extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    let timer = this.props.trackQuiz.categoryStartTime,
        winner = this.props.winner,
        selecting = timer <= 0;
    return (
       selecting?
         <div>{winner} is selecting a category</div>
       :
         <div>Category will be selected by {winner} in {timer} seconds</div>
    );
  }
}

export default withTracker(({gameName, quizId}) => {
  var trackQuiz = TrackQuizQuestion.findOne({gameName: gameName, quizId: quizId});
  return {
    trackQuiz: trackQuiz
  }
})(SelectCategoryCountDown);

