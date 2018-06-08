import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class SelectCategoryCountDown extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    let timer = this.props.trackQuiz.categoryStartTime;
    return (
       <div>Category will be selected by winner in {timer} seconds</div>
    );
  }
}

export default withTracker(({gameName, quizId}) => {
  var trackQuiz = TrackQuizQuestion.findOne({gameName: gameName, quizId: quizId});
  return {
    trackQuiz: trackQuiz
  }
})(SelectCategoryCountDown);

