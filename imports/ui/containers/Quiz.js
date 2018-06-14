import React, { Component } from 'react';
import Image from '../components/Image';
import Button from '../components/Button';
import Question from './Question';
import endMessages from '../constants/end_messages.js';
import CountDown from '../components/CountDown';
import ScoreBoard from '../components/ScoreBoard';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import CountDownCircle from '../components/CountDownCircle';
import FlipCounter from '../components/FlipCounter';
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
      newQuiz: false,
      gotQuiz: false
    };

    this.startQuiz = this.startQuiz.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.finishQuiz = this.finishQuiz.bind(this);
    this.renderQuiz = this.renderQuiz.bind(this);
    this.updateScore = this.updateScore.bind(this); 
    this.renderQuestion = this.renderQuestion.bind(this) ;
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
    if (this.state.newQuiz) {
      console.log("componentDidUpdate, new quiz: " + this.state.quizId);
      this.getQuiz(this.state.quizId);
      this.setState({newQuiz: false});
    }
  }

  renderQuiz() {
    if (this.state.quizId && this.state.questions.length == 0) {
      /* Get new quiz if not already there. */
      this.getQuiz(this.state.quizId); 
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
           gameMode: this.props.mode,
           gotQuiz: true
         })
         userAnswer.questionId = 0;
         userAnswer.quizId = this.state.quizId;
         console.log("Quiz component, getQuiz(), New quiz ID: " + this.state.quizId +
                     " question count: " + questionData.length);
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
    let correctCount = this.state.correct < 7 ? this.state.correct : 6;
    let msg = _.find(endMessages, (o) => { return o.numberCorrect === correctCount });
      return _.sample(msg.comments);
  }

  updateScore(result) {
    if (!this.props.mode || this.props.watchMode == 'watch') {
      if (result) this.setState({correct: this.state.correct + 1});
      return;
    }
    this.remoteSubmitAnswer(result);
  }

  remoteSubmitAnswer(result) {
    var correctAnswer = { gameName: this.props.gameName,
                                quizId: this.props.quizId, 
                                player: this.props.player,
                                question: this.props.currentQuestion,
                                isCorrect: result
                              };
    Meteor.call('submitAnswer', correctAnswer, (err, ret) => {
    });
  }

  nextQuestion() {
    this.setState({
      currentQuestion: (this.state.currentQuestion + 1),
    });
    return;
  }

  finishQuiz() {
    this.setState({
      finished: true,
    })
    this.props.action(this.state.correct, this.state.questionCount);
    console.log("finish quiz");
  }

  startQuiz() {
    this.setState({started : true});
  }

  renderQuestion() {
    let path = this.state.image.fullUrl,
        currentQuestion = this.props.mode ? this.props.currentQuestion : this.state.currentQuestion,
        resultsClass = (this.state.finished) ? 'results is-visible' : 'results is-hidden',
        questionClass = (!this.state.finished) ? 'question-wrap is-visible animate fadeIn': 'question-wrap is-hidden';
    return (
            <div>
              <div className={questionClass}>
                <Question timer={this.state.timer} quest={this.state.questions} 
                    index={currentQuestion} done={this.finishQuiz} next={this.nextQuestion} 
                    score={this.updateScore} 
                    gameMode={this.props.mode} countDown={this.props.countDown}
                    quizComplete={this.props.quizComplete} filePath={path}/>
              </div>
              <div className={resultsClass}>
                <h4>{this._getEndMessage()}</h4>
                <p>You got {this.state.correct} out of {this.state.questionCount} correct.</p>
              </div>
            </div>
    );
  } 

  render() {
    let questionText = {backgroundColor: "tranparent", textAlign: "center", padding: "10px"};
    console.log("Quiz render, quizId: " + this.state.quizId);
    this.renderQuiz();
    let paddingTop = {paddingTop: "12px"},
        path = this.state.image.fullUrl,
        height = this.state.image.height,
        width = this.state.image.width,
        alt = this.state.image.altText,
        credit = this.state.image.credit,
        question = this.state.questions,
        startQuizMessage = "Quiz will start in "; // + this.props.quizStartTime + " seconds",
        gameMode = this.props.mode,
        currentQuestion = this.props.mode ? this.props.currentQuestion : this.state.currentQuestion;
        /* <FlipCounter initValue={0} curVal={this.state.correct}/> */

    let scoreLabel = {paddingRight: "10px", backgroundColor: "#e6f7ff", 
                      color: "#005780", borderWidth: "2px", borderStyle: "groove"},
        noPadding = {padding: "0px", margin: "0px", width: "25%", float: "left"};
    return (
      <div className="Quiz">
        <div className="title-bar small-6 float-center">
          <div className=".top-bar-title float-center">
            <strong dangerouslySetInnerHTML={this._getTitle()}/>
          {
            this.state.started === true || this.props.startQuiz ?
                <div className="float-center" style={paddingTop}>
                  {
                  gameMode ?
                  <ScoreBoard gameName={this.props.gameName} quizId={this.props.quizId} 
                              questionCount={question.length} currentQuestion={currentQuestion + 1}/>
                  :
                  <div>
                    <span style={scoreLabel}>Question {currentQuestion + 1} of {this.state.questions.length}
                        </span>
                    <span style={scoreLabel}>{this.state.correct} Correct</span>
                  </div>
                  }
                </div> 
            :
                <span>
                  {
                    this.props.mode ? 
                       <div style={questionText}>{startQuizMessage}
                          <CountDownCircle fromSeconds={5} countDown={this.props.quizStartTime}
                            color="white"/>
                       </div> 
                       : 
                       <span/>
                  }
                </span>
          }
          </div>
       </div>
        <div className="container">
        {
          (this.state.started  || this.props.startQuiz) && this.state.gotQuiz ?
            <div className="questionContainer"> {this.renderQuestion()} </div>
            :
            <div className="introduction">
              <div className="grid">
                <div className="small-6 float-center">
                   <Image filePath={path} height={height} width={width} alt={alt} credit={credit} />
                </div>
                <div className="small-6 small-push-3">
                  <h5 className="float-center" dangerouslySetInnerHTML={this._getIntroduction()} />
                  {
                    this.props.mode ? <span/>
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
  console.log("trackQuiz, from TrackQuizQuestion: " + JSON.stringify(trackQuiz));
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
    startQuiz: startQuiz,
    quizComplete: trackQuiz.quizComplete,
    categoryStartTime: trackQuiz.categoryStartTime
  };

}) (Quiz);
