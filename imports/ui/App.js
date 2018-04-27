import React, { Component } from 'react';
import axios from 'axios';
import Image from './components/Image';
import Button from './components/Button';
import Question from './containers/Question';
import Quiz from './containers/Quiz';
import Categories from './containers/Categories';
import endMessages from './constants/end_messages.js';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizId: 0,
      gotQuiz: false,
      quizCount: 0,
      totalScore: 0,
      totalQuestion: 0
    };
    this.updateQuizId = this.updateQuizId.bind(this);
    this.handleFinishQuiz = this.handleFinishQuiz.bind(this);

    // this.startApp = this.startApp.bind(this);
  }

  componentDidMount() {
  }

  updateQuizId(quizId) {
    console.log("New Quiz ID: " + quizId);
    this.setState({quizId: quizId, gotQuiz: true});
  }

  handleFinishQuiz(newScore, questionCount) {
    let currentQuizCount = this.state.quizCount,
        currentTotalScore = this.state.totalScore;
        currentTotalQuestion = this.state.totalQuestion;
    
    this.setState({gotQuiz: false, 
                   quizCount: currentQuizCount + 1, 
                   totalScore: currentTotalScore + newScore,
                   totalQuestion: currentTotalQuestion + questionCount});
  }

  render() {
    let quizId = this.state.quizId;
    let gameId = 123;
    return (
      <div className="App">
      {
        this.state.gotQuiz == false ? <Categories action={this.updateQuizId} gameId={gameId} /> :
          <Quiz quizId={quizId} action={this.handleFinishQuiz} />
      }
      </div>
    );
  }
}

export default App;
