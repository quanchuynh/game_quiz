import axios from 'axios';
Future = Npm.require('fibers/future');
var quizUrl = "https://www.britannica.com/quiz/ajax/";
var categories = [];

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

QuizList.prototype.initializeQuizCollection = function() {
  var count = QuizCollection.find().count();
  if (count > 0) {
    console.log("Collection already has " + count + " entries");
    return;
  }

  this.list.forEach(quiz => {
    let quizFromHttp = this.getQuiz(quiz.quiz_id);
    QuizCollection.insert({"id": quizFromHttp.id, 
                           "title": quizFromHttp.id, 
                           "mainCategory": quizFromHttp.mainCategory,
                           "quizType": quizFromHttp.quizType});
    var found = categories.find( function(cat){ 
                  return cat.category === quizFromHttp.mainCategory; 
                });
    if (found) {
      found.quizId.push(quizFromHttp.id);
    }
    else {
      var cat = {"category": quizFromHttp.mainCategory, "quizId": []};
      cat.quizId.push(quizFromHttp.id);
      categories.push(cat);
    }
  });
  CategoryQuizCollection.insert({"cateogry": categories});
}

