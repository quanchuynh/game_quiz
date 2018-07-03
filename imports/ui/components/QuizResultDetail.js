import React, { Component } from 'react';

class QuizResultDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
         title: '',
         questionCount: 0,
         image: '',
         questions: [],
         quizId: this.props.quizId,
         rawFinalResult: ''
      };
    this.getQuiz = this.getQuiz.bind(this);
    this.getResultDetail = this.getResultDetail.bind(this);
  }

  componentDidMount() {
    this.getQuiz(this.props.quizId);
  }

  getResultDetail( ) {
    Meteor.call('getQuizQuestionResult', this.props.gameName, this.props.quizId, (err, ret) => {
      this.setState({rawFinalResult: ret});
      console.debug("rawFinalResult, quizID: " + this.props.quizId + ", results: " + JSON.stringify(this.state.rawFinalResult));
    });
  }

  getQuiz(quizId) {
     /* Get quiz from backend. */
     Meteor.call('getQuiz', this.props.quizId, (err, ret) => {
       let quizData = ret;
       Meteor.call('getQuestion', this.props.quizId, (err, ret2) => {
         let questionData = ret2;
         this.setState({
           title: quizData.title,
           questionCount: quizData.numOfQuestions,
           image: quizData.image,
           questions: questionData,
           quizId: this.props.quizId
         })
         console.log("quizId: " + this.props.quizId + ", game name: " + this.props.gameName);
         this.getResultDetail();
       })
     }); 
  }

  render() {
    let raw = this.state.rawFinalResult,
        players = raw? raw : [],
        questions = this.state.questions;

    console.log("Raw final reulst: " + JSON.stringify(raw));

    let tableStyle = {color: "#005780", lineHeight: "1.2", fontStyle: "normal", fontSize: "12px"};


    return (
      <div>
        <h5 style={{color: "#005780", textAlign: "center"}}>{this.state.title} ({this.state.questionCount} questions)</h5>
        <table style={tableStyle}>
          <thead>
          <tr style={tableStyle}>
             <th>Question #</th>
             <th>Question</th>
             <th>Answer</th>
             <th>Explanation</th>
             { players.map((player, i) => (<th key={i}>{player.player}</th>)) }
          </tr>
          </thead>
          <tbody>
          {
            questions.map((p, i) => (
              <tr key={i}>
              <td>{i + 1}</td>
              <td>{p.question}</td>
              <td>{p.answers[ p.correct - 1 ]}</td>
              <td>{p.explanation}</td>
              {players.map( (player, jj) => (<td key={jj}>{player.questionScore[i]}</td>) )}
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default QuizResultDetail;
