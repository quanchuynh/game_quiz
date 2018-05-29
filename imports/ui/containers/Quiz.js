import React, { Component } from 'react';
import Image from '../components/Image';
import Button from '../components/Button';
import Question from './Question';
import endMessages from '../constants/end_messages.js';
import CountDown from '../components/CountDown';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

/* props: quizId, mode, action */

class Quiz extends Component {
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
      questions: [],
      quizId: 0,
      newQuiz: false
    };

    this.startQuiz = this.startQuiz.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.finishQuiz = this.finishQuiz.bind(this);
  }

  componentDidMount() {
    this.getQuiz(this.props.quizId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("Quiz, derived state, gameMode: " + prevState.mode);
    if (!nextProps.mode) return null;
    if (prevState.quizId !== nextProps.quizId) {
      console.log("Quiz component, derived state, quiz ID: " + nextProps.quizId);
      return {quizId: nextProps.quizId, newQuiz: true};
    }
    return null;
  }

  componentDidUpdate() {
    console.log("componentDidUpdate: " + this.state.quizId);
    if (this.state.newQuiz) {
      this.getQuiz(this.state.quizId);
      this.setState({newQuiz: false});
    }
  }

  getQuiz(quizId) {
     /* Get quiz from backend. */
     Meteor.call('getQuiz', this.props.quizId, (err, ret) => {
       let quizData = ret;
       Meteor.call('getQuestion', this.props.quizId, (err, ret2) => {
         let questionData = ret2;
         this.setState({
           title: quizData.title,
           introduction: quizData.description,
           tags: quizData.keywords,
           questionCount: quizData.numOfQuestions,
           image: quizData.image,
           timer: quizData.seconds,
           questions: questionData,
           quizId: quizId,
           currentQuestion: 0,
           gameMode: this.props.mode
         })
         userAnswer.questionId = 0;
         userAnswer.quizId = this.state.quizId;
         console.log("Quiz component, New quiz ID: " + this.state.quizId);
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
    if (!this.props.mode) {
      this.setState({
        currentQuestion: (this.state.currentQuestion + 1),
        correct: (result) ? (this.state.correct + 1) : this.state.correct
      });
      return;
    }

    if (result) {
      var correctAnswer = { gameName: this.props.gameName,
                                  quizId: this.props.quizId, 
                                  player: this.props.player,
                                  currentQuestion: this.props.currentQuestion
                                };
      Meteor.call('submitCorrectAnswer', correctAnswer, (err, ret) => {
      });
    }
  }

  finishQuiz(result) {
    this.setState({
      finished: true,
      correct: (result) ? (this.state.correct + 1) : this.state.correct
    })

    this.props.action(this.state.correct, this.state.questionCount);
  }

  startQuiz() {
    this.setState({started : true});
  }

  render() {
    let paddingTop = {paddingTop: "12px"},
        path = this.state.image.fullUrl,
        height = this.state.image.height,
        width = this.state.image.width,
        alt = this.state.image.altText,
        credit = this.state.image.credit,
        questionObject = this.state.questions,
        question = questionObject,
        resultsClass = (this.state.finished) ? 'results is-visible' : 'results is-hidden',
        questionClass = (!this.state.finished) ? 'question-wrap is-visible animate fadeIn': 'question-wrap is-hidden',
        startQuizMessage = "Quiz will start in " + this.props.quizStartTime + " sconds",
        currentQuestion = this.props.mode ? this.props.currentQuestion : this.state.currentQuestion;

    let scoreLabel = {paddingRight: "10px", backgroundColor: "#e6f7ff", 
                      color: "#005780", borderWidth: "2px", borderStyle: "groove"};
    return (
      <div className="Quiz">
        <div className="title-bar small-6 float-center">
          <div className=".top-bar-title float-center">
            <strong dangerouslySetInnerHTML={this._getTitle()}/>
          {
            this.state.started === true || this.props.startQuiz ?
              <div className="float-center" style={paddingTop}>
                <span style={scoreLabel}>Question {currentQuestion + 1} out of {this.state.questions.length}
                      </span>
                <span style={scoreLabel}>{this.state.correct} Correct</span>
              </div> :
              <p></p>
          }
          </div>
       </div>
        <div className="container">
        {
          this.state.started  || this.props.startQuiz ?
            <div className="quiz">
              <div className={questionClass}>
                <Question timer={this.state.timer} quest={this.state.questions} 
                    index={currentQuestion} done={this.finishQuiz} next={this.nextQuestion} 
                    gameMode={this.props.mode}
                    filePath={path}/>
              </div>
              <div className={resultsClass}>
                <h4>{this._getEndMessage()}</h4>
                <p>You got {this.state.correct} out of {this.state.questionCount} correct.</p>
              </div>
            </div>
            :
            <div className="introduction">
              <div className="grid">
                <div className="small-6 float-center">
                   <Image filePath={path} height={height} width={width} alt={alt} credit={credit} />
                </div>
                <div className="small-6 small-push-3">
                  <p className="float-center" 
                     dangerouslySetInnerHTML={this._getIntroduction()} />
                  {
                    this.props.mode ?
                      <div>{startQuizMessage}</div>
                    :
                      <Button copy="Start Quiz" action={this.startQuiz} clName='success'/>
                  }
                </div>
              </div>
            </div>
        }
        </div>
      </div>
    );
  }
}

/* props: quizId, mode, action */
export default withTracker(({gameName, mode, player, quizId, action}) => {
  if (!mode) {
    return {mode: mode, quizId: quizId, action: action, startQuiz: false};
  }

  console.log("trackQuiz, gameName: " +  gameName + ", quizId: " + quizId);

  var trackQuiz = TrackQuizQuestion.findOne({gameName: gameName, quizId: quizId});
  console.log("trackQuiz: " + JSON.stringify(trackQuiz));
  let startQuiz = trackQuiz.quizStartTime <= 0 ? true : false;
  return {
    mode: mode, 
    gameName: gameName, 
    quizId: quizId, 
    player: player,
    action: action,
    currentQuestion: trackQuiz.currentQuestion,
    countDown: trackQuiz.countDown,
    quizStartTime: trackQuiz.quizStartTime,
    startQuiz: startQuiz
  };

}) (Quiz);
