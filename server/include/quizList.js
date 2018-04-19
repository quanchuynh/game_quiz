import axios from 'axios';
Future = Npm.require('fibers/future');
var quizUrl = "https://www.britannica.com/quiz/ajax/";

QuizList = function(quizListFileName) {
  this.list = JSON.parse(Assets.getText(quizListFileName));
}

QuizList.prototype.findWhere = function(nvPair) {
  return _.findWhere(this.list, nv_pair);
}

QuizList.prototype.getQuizList = function(quizId) {
  return this.list; 
}

QuizList.prototype.getQuiz = function(quizId) {
  var fut = new Future();
  var data;
  axios.get(quizUrl + quizId)
    .then(ret => { 
            data = ret.data;
            fut.return(data);
         });
  return fut.wait();
}

QuizList.prototype.getQuestion = function(quizId) {
  var fut = new Future();
  var data;
  axios.get(quizUrl + quizId + "/questions")
    .then(ret => { 
            data = ret.data;
            fut.return(data);
         });
  return fut.wait();
}

