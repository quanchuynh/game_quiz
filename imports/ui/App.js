import React, { Component } from 'react';
import axios from 'axios';
import Image from './components/Image';
import Button from './components/Button';
import Question from './containers/Question';
import endMessages from './constants/end_messages.js';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      introduction: '',
      image: {},
      tags: '',
      timer: 0,
      questionCount: '',
      currentQuestion: 0,
      correct: 0,
      incorrect: 0,
      started: false,
      finished: false,
      questions: []
    };

    this.startQuiz = this.startQuiz.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.finishQuiz = this.finishQuiz.bind(this);
  }
  componentDidMount() {
    //Set up initial state of component based off of the json files
    //provided.

/* Get data from backend instead
    axios.get('quiz.json')
      .then(res => {
        let quizData = res.data;
        axios.get('questions.json')
          .then(res=> {
            let questionData = res.data;
            this.setState({
              title: quizData.title,
              introduction: quizData.introduction,
              tags: quizData.keywords,
              questionCount: quizData.numOfQuestions,
              image: quizData.thumbnail,
              timer: quizData.seconds,
              questions: questionData
            })
        })
      })
*/
     Meteor.call('getQuiz', 5011, (err, ret) => {
       let quizData = ret;
       Meteor.call('getQuestion', 5011, (err, ret2) => {
         let questionData = ret2;
         console.log("title: " + quizData.title + ", image: " + JSON.stringify(quizData.thumbnail));
         this.setState({
           title: quizData.title,
           introduction: quizData.introduction,
           tags: quizData.keywords,
           questionCount: quizData.numOfQuestions,
           image: quizData.thumbnail,
           timer: quizData.seconds,
           questions: questionData
         })
       })
     }); 
  }
  _getTitle() {
    return {__html: this.state.title};
  }
  _getIntroduction() {
    return {__html: this.state.introduction};
  }
  _getEndMessage() {
    let msg = _.find(endMessages, (o) => { return o.numberCorrect === this.state.correct });
        return _.sample(msg.comments);
  }
  nextQuestion(result) {
    this.setState({
          currentQuestion: (this.state.currentQuestion + 1),
          correct: (result) ? (this.state.correct + 1) : this.state.correct
    });
  }
  finishQuiz(result) {
    this.setState({
      finished: true,
      correct: (result) ? (this.state.correct + 1) : this.state.correct
    })
  }
  startQuiz() {
    this.setState({started : true});
  }
  render() {
    let path = this.state.image.filePath,
        height = this.state.image.height,
        width = this.state.image.width,
        alt = this.state.image.altText,
        credit = this.state.image.credit,
        questionObject = this.state.questions,
        question = questionObject,
        resultsClass = (this.state.finished) ? 'results is-visible' : 'results is-hidden',
        questionClass = (!this.state.finished) ? 'question-wrap is-visible animate fadeIn': 'question-wrap is-hidden';
    return (
      <div className="App">
        <div className="title-bar">
          <div className="top-bar-title">
            <strong dangerouslySetInnerHTML={this._getTitle()}/>
          </div>
          {
            this.state.started === true ?
              <div className="top-bar-right">
                  <span className="label">{this.state.currentQuestion + 1} / {this.state.questions.length}</span>
              </div> :
              <div></div>
          }
        </div>
        <div className="container">
        {
          this.state.started === false ?
            <div className="introduction">
              <div className="grid">
                <div className="small-12">
                  <Image filePath={path} height={height} width={width} alt={alt} credit={credit} />
                </div>
                <div className="small-6 small-push-3">
                  <p className="float-center" dangerouslySetInnerHTML={this._getIntroduction()} />
                  <p>Remember to stick around until the end to see how you did!</p>
                  <Button copy="Start Quiz" action={this.startQuiz} clName='success'/>
                </div>
            </div>
          </div>:
            <div className="quiz">
              <div className={questionClass}>
                <Question timer={this.state.timer} quest={this.state.questions} index={this.state.currentQuestion} done={this.finishQuiz} next={this.nextQuestion} />
              </div>
              <div className={resultsClass}>
                <h4>{this._getEndMessage()}</h4>
                <p>You got {this.state.correct} out of {this.state.questionCount} correct.</p>
              </div>
            </div>
        }
        </div>
      </div>
    );
  }
}

export default App;
