import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import CountDownCircle from '../components/CountDownCircle';

class SelectCategoryCountDown extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    let timer = this.props.trackQuiz.categoryStartTime,
        winner = this.props.winner,
        selecting = timer <= 0,
        messageStyle = {color: "#005780", backgroundColor: "tranparent",
                        position: "relative", top: "20px", textAlign: "center", fontSize: "24px"};
    return (
       selecting?
         <div style={messageStyle}>{winner} is selecting a category</div>
       :
         <div style={messageStyle}>Category will be selected by {winner} in {timer} seconds</div>
    );
  }
}

export default withTracker(({gameName, quizId}) => {
  var trackQuiz = TrackQuizQuestion.findOne({gameName: gameName, quizId: quizId});
  return {
    trackQuiz: trackQuiz
  }
})(SelectCategoryCountDown);

