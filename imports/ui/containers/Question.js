import React, { Component } from 'react';
import Button from '../components/Button';
import Answer from '../components/Answer';
import { withTracker } from 'meteor/react-meteor-data';
import { QuestionState } from '../../../lib/gCollection';
import CountDownCircle from '../components/CountDownCircle';

import '../index.css';

const nextQuestionTime = 2;

/* props: timer, gameMode, quest, index, done(isCorrect), next(isCorrect), filePath */

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answered : false,
      index: this.props.index,
      currentCount: nextQuestionTime,
      questionTime: this.props.timer,
      questionTimeLeft: this.props.timer,
      disableButton: false,
      isCorrect: false,
      correctAnswer: '',
      userAnswer: '',
      gameMode: this.props.gameMode
    };
    this.intervalId = setInterval(this.timer.bind(this), 1000);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleExpiration = this.handleExpiration.bind(this);
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleRemoteExpiration = this.handleRemoteExpiration.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.debug("Question, getDerivedStateFromProps, " + prevState.index + " " + nextProps.index);
    if (prevState.index !== nextProps.index) {
      return {answered : false, index: nextProps.index}
    }
    return null;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  timer() {
    if (this.props.quizComplete) {
      clearInterval(this.intervalId);
      return;
    }
    if (this.props.gameMode) {
      this.remoteTimer();
    }
    else this.practiceTimer();
  }

  remoteTimer() {
    console.debug("remoteTimer, countDown: " + this.props.countDown + ", quiz index: " + this.props.index);
    if (this.props.quizComplete) return;
    if (this.props.countDown < 2) {
      this.handleRemoteExpiration();
      console.debug("remoteTimer: resetQuestion");
      if (this.props.questionDelayTime < 1) this._resetQuestion();
      return;
    }
    console.debug("remoteTimer, time: " + this.props.countDown + " quiz index: " + this.props.index);
    this.setState({questionTimeLeft: this.props.countDown });
  }

  lastQuiz() {
    return (this.props.index + 1) >= this.props.quest.length
  }

  practiceTimer() {
    this.setState({
      questionTimeLeft: this.state.questionTimeLeft - 1
    })
    if(this.state.questionTimeLeft < 1) {
      clearInterval(this.intervalId);
      this.setState({questionTimeLeft : this.state.questionTime}, () => {
          this.handleExpiration();
      })
    }
  }

  isLastQuestion() {
    return (this.props.index == this.props.quest.length - 1);
  }

  _getQuestion() {
/*
    if (this.props.gameMode && this.props.quizComplete)
      this.props.done();
*/
    return {__html:  this.props.quest[this.props.index].question};
  }
  _getExplanation() {
    return {__html:  this.props.quest[this.props.index].explanation};
  }

  _resetQuestion() {
    this.setState({
      answered: false,
    }, () => {
      if ((this.props.index + 1) >= this.props.quest.length) {
        this.props.done();
      }
      else {
        this.props.next();
        this.intervalId = setInterval(this.timer.bind(this), 1000);
      }
    });
  }

  /*--Handles the true false button clicks--*/
  /*--
      Takes in the answer which is read in as "fact" or "fiction"
      we could probably re-factor this to read in data-attributes
      so we don't have to convert the answer to a numerical value
      later.
  --*/
  handleAnswer(userAnswer) {
    let correctAnswerIndex = this.props.quest[this.props.index].correct - 1,     //the correct answer for this question
        correctAnswer = this.props.quest[this.props.index].answers[correctAnswerIndex]
        isCorrect = (userAnswer === correctAnswer) ? true : false;

    if (!this.props.gameMode) {
      clearTimeout(this.intervalId); /* local timer is used for check remote time in game mode. */
    }
    this.setState({
      isCorrect: isCorrect,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer,
      questionTimeLeft: 0 /* New code */
    })

    this.props.score(isCorrect);

    console.debug("handleAnswer: " + this.props.index + ", is correct: " + isCorrect);

    //set the question to answered which wil hide the buttonVisibility
    this.setState({answered: true, currentCount: nextQuestionTime}, ()=> {
      this.setState({ disableButton: true })
    });
  }

  handleNextQuestion(unusedParamter) {
    this.setState({questionTimeLeft: this.props.timer});
    this._resetQuestion();
    console.debug(JSON.stringify(userAnswer));
  }

  handleRemoteExpiration() {
    //set the question to answered which wil hide the buttonVisibility
    let correctAnswerIndex = this.props.quest[this.props.index].correct - 1,
        correctAnswer = this.props.quest[this.props.index].answers[correctAnswerIndex];
    if (this.state.answered) return;
    /* Real expiration condition */
    this.setState({
      answered: true, 
      isCorrect: false,
      correctAnswer: correctAnswer,
      userAnswer: ""
    })
  }

  handleExpiration() {
    //set the question to answered which wil hide the buttonVisibility
    let correctAnswerIndex = this.props.quest[this.props.index].correct - 1,
        correctAnswer = this.props.quest[this.props.index].answers[correctAnswerIndex];
    this.setState({
      answered: true, 
      isCorrect: false,
      correctAnswer: correctAnswer,
      userAnswer: "no answer"
    })
  }

  render() {
    console.debug("Question component, questionCount: " + this.props.quest.length + 
            " index: " + this.props.index + ", quiz complete: " + this.props.quizComplete);
    let isGameMode = this.state.gameMode,
        visibility = this.state.answered ? 'callout secondary is-visible' : 'callout secondary is-hidden',
        buttonVisibility = this.state.answered ? 'is-hidden': 'is-visible'; 
	gameAnswer = isGameMode && this.state.answered,
        showAnswerResponse = gameAnswer && this.state.userAnswer ? 'is-visible' : 'is-hidden',
        answerReflectText = this.state.isCorrect ? 'Correct !' : 'Incorrect';

    let backgroundImage = {opacity: 0.1, width: "100%"};
    let questionText = {color: "#005780", backgroundColor: "tranparent", 
                        position: "absolute", top: "220px", textAlign: "center"},
        answerPosition = {position: "absolute", top: "300px", marginLeft: "0px", 
                          paddingLeft: "0px", paddingRight: "0px", width: "47.2%"},
        answerResponseText = {backgroundColor: "red", color: "white", fontSize: "32px", top: "200px", 
                              margin: "0 auto", width: "30%"}; 

    if (this.state.isCorrect) answerResponseText.backgroundColor = "green";
    let timeText = {color: "#005780", backgroundColor: "tranparent", 
                    textAlign: "center", position: "absolute", top: "60px", width: "50%", margin: "0 auto"};
    if (isGameMode) {
      timeText.width = "80%";
      timeText.top = "35px"
      timeText.margin = "0 0 auto auto"; /* top, right, bottom, left */
    }

    let questionMap = this.props.quest[this.props.index].answers;
    let colors = ["orange", "maroon", "green", "blue" ];
    let incorrectText = {color: "red"}, correctText = {color: "green"}
    let lastQuestion = (this.props.index == this.props.quest.length - 1);
    let timeLeft = isGameMode ? this.props.countDown : this.state.questionTimeLeft;

    let renderExplanation, renderUserAnswer;
    if (isGameMode && this.props.questionDelayTime) {
      renderExplanation =<h5 style={{textAlign: "center", color: "#005780"}}>Next Question in {this.props.questionDelayTime} seconds</h5>;
      renderUserAnswer = <p> Correct answer: {this.state.correctAnswer}</p>;
    }
    else {
      renderExplanation = lastQuestion ?
           <Button clName='button-2' copy='Select Another Quiz' action={this.handleNextQuestion}/>
           :
           <Button clName='button-2' copy='Next Question' action={this.handleNextQuestion}/>;
      renderUserAnswer = this.state.isCorrect ? <p style={correctText}>Correct</p> 
                 : 
                   <div>
                      <p style={incorrectText}>Incorrect</p>
                      <p> Correct answer: {this.state.correctAnswer}, your answer: {this.state.userAnswer}</p>
                   </div>
    }

    return (
      <div className="question">
        <div className="grid">
          <div className="columns small-6 float-center">
            <h5 className="float-center"> </h5>
            <h5 className={showAnswerResponse} style={answerResponseText}>{answerReflectText}</h5>
            <img src={this.props.filePath} style={backgroundImage}/>
            <h5 className="small-5" dangerouslySetInnerHTML={this._getQuestion()} style={questionText}>
            </h5>
            {
              (timeLeft > 0 && timeLeft < 6) ?
                <div className="float-center" style={timeText}>
                <CountDownCircle fromSeconds={5} countDown={timeLeft} color="#005780"/>
                seconds left
                </div>
                :
                <span/>
            }
            <div className={visibility}>
              {renderUserAnswer}
              <h5 className="float-center" dangerouslySetInnerHTML={this._getExplanation()}/>
              {renderExplanation}
            </div>
            <div className={buttonVisibility} style={answerPosition}>
            {
              questionMap.map((answer, i) => (<p key={i} className="no-padding"><Answer copy={answer} 
                action={this.handleAnswer} clName={colors[i%4] + " button-whole"} /></p>))
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
