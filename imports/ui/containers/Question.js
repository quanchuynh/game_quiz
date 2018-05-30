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
      this.setState({ questionTimeLeft: 0 });
      clearInterval(this.intervalId);
      return;
    }
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

  _resetQuestion(isCorrect) {
    this.setState({
      answered: false,
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
      isCorrect: isCorrect,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer 
    })

    //set the question to answered which wil hide the buttonVisibility
    this.setState({answered: true, currentCount: nextQuestionTime}, ()=> {
      this.setState({ disableButton: true })
    });
  }

  handleNextQuestion(notUse) {
    this.setState({questionTimeLeft: this.props.timer});
    this._resetQuestion(this.state.isCorrect);
    console.debug(JSON.stringify(userAnswer));
  }

  handleExpiration() {
    //set the question to answered which wil hide the buttonVisibility
    this.setState({answered: true, isCorrect: false});
  }

  render() {
    console.log("Question component, questionCount: " + this.props.quest.length + 
            " index: " + this.props.index + ", quiz complete: " + this.props.quizComplete);
    let visibility = (this.state.answered && this.state.gameMode == false) ? 'callout secondary is-visible' : 'callout secondary is-hidden';
    let buttonVisibility = (this.state.answered) ? 'columns small-6 is-hidden' : 
                                                   'columns small-6 is-visible float-center';
    let backgroundImage = {opacity: 0.2, width: "100%"};
    let questionText = {color: "#005780", backgroundColor: "tranparent", 
                        position: "absolute", top: "120px", float: "left"};
    let timeText = {color: "#005780", backgroundColor: "tranparent"};
    let questionMap = this.props.quest[this.props.index].answers;
    let colors = ["orange", "maroon", "green", "blue" ];
    let incorrectText = {color: "red"}, correctText = {color: "green"}
    return (
      <div className="question">
        <div className="grid">
          <div className="columns small-6 float-center">
            <img src={this.props.filePath} alt="Norway" style={backgroundImage}/>
            <h4 className="small-5" dangerouslySetInnerHTML={this._getQuestion()} style={questionText}>
            </h4>
            <h4 style={timeText}>{this.state.questionTimeLeft} seconds left</h4>
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
              <Button clName='button-2' copy='Next Question' action={this.handleNextQuestion}/>
            </div>
          </div>
          <div className={buttonVisibility}>
          {
            this.props.quizComplete ?
              <div style={timeText}> Quiz Completed </div>
            :
              questionMap.map((answer, i) => (<p key={i} className="no-padding"><Answer copy={answer} action={this.handleAnswer} 
                clName={colors[i%4] + " button-whole"} /></p>))
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

