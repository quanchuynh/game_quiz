import React, { Component } from 'react';
import axios from 'axios';
import Image from '../components/Image';
import Button from '../components/Button';
import Question from '../containers/Question';
import Quiz from '../containers/Quiz';
import Categories from '../containers/Categories';
import NavBar from '../navigation/NavBar';
import endMessages from '../constants/end_messages.js';
import _ from 'lodash';

/* props: gameMode gameName categorySelector player */

class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizId: 0,
      gotQuiz: false,
      quizCount: 0,
      totalScore: 0,
      gameMode: false,
      totalQuestion: 0
    };
    this.updateQuizId = this.updateQuizId.bind(this);
    this.handleFinishQuiz = this.handleFinishQuiz.bind(this);
  }

  componentDidMount() {
    if (this.props.gameMode) {
      this.setState({gameMode: true});
    }
  }

  updateQuizId(quizId) {
    console.debug("New Quiz ID: " + quizId);
    this.setState({quizId: quizId, gotQuiz: true});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.quizId !== nextProps.quizId)
      return {quizId: nextProps.quizId,
              gotQuiz: true
             };
    return null;
  }


  handleFinishQuiz(newScore, questionCount) {
    let currentQuizCount = this.state.quizCount,
        currentTotalScore = this.state.totalScore,
        currentTotalQuestion = this.state.totalQuestion;
    
    this.setState({gotQuiz: false, 
                   quizCount: currentQuizCount + 1, 
                   totalScore: currentTotalScore + newScore,
                   totalQuestion: currentTotalQuestion + questionCount});
  }

  render() {
    let quizId = this.state.quizId,
        gameId = this.props.gameName ?  this.props.gameName : 123;
        categorySelector = this.props.categorySelector,
        player = this.props.player;

    console.log("Practice props: " + JSON.stringify(this.props));

    // <p className="lead">Your Score: {this.state.totalScore} out of {this.state.totalQuestion}</p>
    return (
      <div className="Practice">
      {
        this.state.gotQuiz == false ? 
          <Categories action={this.updateQuizId} gameId={gameId} mode={this.state.gameMode} 
             player={player} categorySelector={categorySelector}/> 
          :
          <Quiz quizId={quizId} action={this.handleFinishQuiz} mode={this.state.gameMode}/>
      }
      </div>
    );
  }
}

export default Practice;
