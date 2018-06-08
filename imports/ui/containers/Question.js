import React, { Component } from 'react';
import Button from '../components/Button';
import Answer from '../components/Answer';
import { withTracker } from 'meteor/react-meteor-data';
import { QuestionState } from '../../../lib/gCollection';
import '../index.css';

const nextQuestionTime = 2;

/* props: timer, gameMode, quest, index, done(isCorrect), next(isCorrect), filePath */

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answered : false,
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
  }

  timer() {
    if (this.props.quizComplete) {
      // this.setState({ questionTimeLeft: 0 });
      clearInterval(this.intervalId);
      return;
    }
    if (this.props.gameMode) {
      this.remoteTimer();
    }
    else this.practiceTimer();
  }

  remoteTimer() {
    if (this.props.quizComplete) return;
    if (this.props.countDown < 1) {
      this.handleExpiration();
      return;
    }
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

    clearTimeout(this.intervalId);
    this.setState({
      isCorrect: isCorrect,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer 
    })

    this.props.score(isCorrect);

    console.log("handleAnswer: " + this.props.index + ", is correct: " + isCorrect);

    //set the question to answered which wil hide the buttonVisibility
    this.setState({answered: true, currentCount: nextQuestionTime}, ()=> {
      this.setState({ disableButton: true })
    });

    if (this.props.gameMode && !this.lastQuiz()) this._resetQuestion();
  }

  handleNextQuestion(notUse) {
    this.setState({questionTimeLeft: this.props.timer});
    this._resetQuestion();
    console.debug(JSON.stringify(userAnswer));
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
    console.log("Question component, questionCount: " + this.props.quest.length + 
            " index: " + this.props.index + ", quiz complete: " + this.props.quizComplete);
    let visibleTest = this.state.answered && this.state.gameMode == false;
    let visibility = visibleTest ? 'callout secondary is-visible' : 'callout secondary is-hidden';
    let buttonVisibility = visibleTest ? 'columns small-6 is-hidden' : 
                                                   'columns small-6 is-visible float-center';
    let backgroundImage = {opacity: 0.2, width: "100%"};
    let questionText = {color: "#005780", backgroundColor: "tranparent", 
                        position: "absolute", top: "130px", textAlign: "center"};
    let timeText = {color: "#005780", backgroundColor: "tranparent", textAlign: "center"};
    let questionMap = this.props.quest[this.props.index].answers;
    let colors = ["orange", "maroon", "green", "blue" ];
    let incorrectText = {color: "red"}, correctText = {color: "green"}
    let lastQuestion = (this.props.index == this.props.quest.length - 1);
    let timeLeft = this.props.gameMode ? this.props.countDown : this.state.questionTimeLeft;
    return (
      <div className="question">
        <div className="grid">
          <div className="columns small-6 float-center">
            <img src={this.props.filePath} style={backgroundImage}/>
            <h5 className="small-5" dangerouslySetInnerHTML={this._getQuestion()} style={questionText}>
            </h5>
            {
              timeLeft > 0 ?
                <h4 style={timeText}>{timeLeft} seconds left</h4> : <span/>
            }
            <div className={visibility}>
              {
                 this.state.isCorrect ? 
                   <p style={correctText}>Correct</p> 
                 : 
                   <div>
                      <p style={incorrectText}>Incorrect</p>
                      <p> Correct answer: {this.state.correctAnswer}, your answer: {this.state.userAnswer}</p>
                   </div>
              }
              <h4 className="float-center" dangerouslySetInnerHTML={this._getExplanation()}/>
              {
                lastQuestion ?
                  <Button clName='button-2' copy='Select Another Quiz' action={this.handleNextQuestion}/>
                :
                  <Button clName='button-2' copy='Next Question' action={this.handleNextQuestion}/>
              }
            </div>
          </div>
          <div className={buttonVisibility}>
            {
              questionMap.map((answer, i) => (<p key={i} className="no-padding"><Answer copy={answer} 
                action={this.handleAnswer} clName={colors[i%4] + " button-whole"} /></p>))
            }
          </div>
        </div>
      </div>
    );
  }
}

// export default Question;

export default withTracker(() => {
  return {
    events: QuestionState.find(userAnswer).fetch()
  }
})(Question);

