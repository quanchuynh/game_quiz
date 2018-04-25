import React, { Component } from 'react';
import Button from '../components/Button';
import '../index.css';

const nextQuestionTime = 2;

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answered : false,
      currentCount: nextQuestionTime,
      questionTime: this.props.timer,
      questionTimeLeft: this.props.timer,
      disableButton: false
    };
    this.intervalId = setInterval(this.timer.bind(this), 1000);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleExpiration = this.handleExpiration.bind(this);
  }

  timer() {
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
  _getQuestion() {
    return {__html:  this.props.quest[this.props.index].question};
  }
  _getExplanation() {
    return {__html:  this.props.quest[this.props.index].explanation};
  }
  _resetQuestion(isCorrect, to) {
    clearInterval(to);
    this.setState({
      answered: false,
      currentCount: nextQuestionTime
    }, () => {
      if ((this.props.index + 1) >= this.props.quest.length) {
        this.props.done(isCorrect);
      }
      else {
        this.props.next(isCorrect);
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
  handleAnswer(answer) {
    let correctAnswer = this.props.quest[this.props.index].correct,     //the correct answer for this question
        userAnswer = (answer === 'Fact') ? 1 : 2,     //what the user answered
        isCorrect = (userAnswer === correctAnswer) ? true : false; //translate into a bool

    clearTimeout(this.intervalId);
    this.setState({
      questionTimeLeft: this.state.questionTime
    })
    //set the question to answered which wil hide the buttonVisibility
    //set the time to elapse until the next question comes up
    this.setState({answered: true, currentCount: nextQuestionTime}, ()=> {
      //counts down from a number
      var self = this;
      this.setState({ disableButton: true })
      let to = setInterval(() => {
        this.setState({
          currentCount: this.state.currentCount - 1
        }, () => {
          if (self.state.currentCount <= 0) {
            self._resetQuestion(isCorrect, to);
            this.setState({ disableButton: false })
          }
        })
      }, 1000);
    });
  }
  handleExpiration() {
    //set the question to answered which wil hide the buttonVisibility
    //set the time to elapse until the next question comes up
    this.setState({answered: true, currentCount: nextQuestionTime}, ()=> {
      var self = this;
      let to = setInterval(() => {
        this.setState({
          currentCount: this.state.currentCount - 1
        }, () => {
          if (self.state.currentCount === 0) {
            //if time ran out then the answer is wrong
            self._resetQuestion(false, to);
          }
        })
      }, 1000);
    });
  }
  render() {
    let visibility = (this.state.answered) ? 'callout secondary is-visible' : 'callout secondary is-hidden';
    let buttonVisibility = (this.state.answered) ? 'columns small-6 is-hidden' : 'columns small-6 is-visible';
    let questionMap = this.props.quest[this.props.index].answers;
    console.log("Possible answers: " + questionMap.length);
    return (
      <div className="question__question">
        {this.state.questionTimeLeft}
        <div className="grid">
          <div className="columns small-12">
            <h1 dangerouslySetInnerHTML={this._getQuestion()} />
            <div className={visibility}>
            <h4 dangerouslySetInnerHTML={this._getExplanation()}/>
            <small>Next question in {this.state.currentCount} seconds.</small>
            </div>
          </div>
          <div className={buttonVisibility}>
          {
            questionMap.map((answer, i) => (<Button key={i} copy={answer} action={this.handleAnswer} clName='success'/>))
          }
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
