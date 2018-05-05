import React, { Component } from 'react';
import Button from '../components/Button';
import Answer from '../components/Answer';
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
  handleAnswer(userAnswer) {
    let correctAnswerIndex = this.props.quest[this.props.index].correct - 1,     //the correct answer for this question
        correctAnswer = this.props.quest[this.props.index].answers[correctAnswerIndex]
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
    let buttonVisibility = (this.state.answered) ? 'columns small-6 is-hidden' : 
                                                   'columns small-6 is-visible float-center';
    let backgroundImage = {opacity: 0.2, width: "100%"};
    let questionText = {color: "#005780", backgroundColor: "tranparent", 
                        position: "absolute", top: "90px", float: "left"};
    let questionMap = this.props.quest[this.props.index].answers;
    let colors = ["orange", "maroon", "green", "blue" ];
    console.log("Possible answers: " + questionMap.length);
    return (
      <div className="question">
        {this.state.questionTimeLeft}
        <div className="grid">
          <div className="columns small-6 float-center">
            <img src={this.props.filePath} alt="Norway" style={backgroundImage}/>
            <h4 className="small-5" dangerouslySetInnerHTML={this._getQuestion()} style={questionText}/>
            <div className={visibility}>
              <h4 className="float-center" dangerouslySetInnerHTML={this._getExplanation()}/>
              <small>Next question in {this.state.currentCount} seconds.</small>
            </div>
          </div>
          <div className={buttonVisibility}>
          {
            questionMap.map((answer, i) => (<p key={i} className="no-padding"><Answer copy={answer} action={this.handleAnswer} 
              clName={colors[i%4] + " button-whole"} /></p>))
          }
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
