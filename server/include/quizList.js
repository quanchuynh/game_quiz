import axios from 'axios';
Future = Npm.require('fibers/future');
var quizUrl = "https://www.britannica.com/quiz/ajax/";
var categories = [];
var quizTypes = [];

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
    var categoryQuiz = CategoryQuizCollection.findOne({"ID": "category"});
    if (categoryQuiz)
      categories = categoryQuiz.category;
    return;
  }

  this.list.forEach(quiz => {
    let quizFromHttp = this.getQuiz(quiz.quiz_id);
    QuizCollection.insert({"id": quizFromHttp.id, 
                           "title": quizFromHttp.title, 
                           "mainCategory": quizFromHttp.mainCategory,
                           "quizType": quizFromHttp.quizType,  
                           "imagePath": quizFromHttp.image.fullUrl});

    var found = categories.find( (cat) => cat.category === quizFromHttp.mainCategory);
    if (found) { 
      found.quizId.push(quizFromHttp.id);
    }
    else {
      var cat = {"category": quizFromHttp.mainCategory, "quizId": []};
      cat.quizId.push(quizFromHttp.id);
      categories.push(cat);
    }

    found = quizTypes.find( (cat) => cat.quizType === quizFromHttp.quizType);
    if (found) { 
      found.quizId.push(quizFromHttp.id);
    }
    else {
      var cat = {"quizType": quizFromHttp.quizType, "quizId": []};
      cat.quizId.push(quizFromHttp.id);
      quizTypes.push(cat);
    }
  });
  CategoryQuizCollection.insert({"category": categories, "ID": "category"});
  CategoryQuizCollection.insert({"quizType": quizTypes, "ID": "quizType"});
}

var getQuizIdForCategory

var getNewCategoryQuizId = function(categoryName) {
  /* Return this category and array of single new quiz ID. */
  var categoryQuizId = {"category": categoryName, "quizId": []};
  let quiz = getQuizFromCategory(categoryName);
  let index = getRandomIndex(quiz.length);
  console.log("getNewCategoryQuizId - " + categoryName + ": " + JSON.stringify(quiz));
  console.log("getNewCategoryQuizId - index: " + index);
  let quizId = quiz[ index ];
  console.log("getNewCategoryQuizId - quiz ID: " + quizId);
  categoryQuizId.quizId.push(quizId);
  return categoryQuizId;
}

var getNewGameQuizId = function(gameId, categoryName) {
  var arrayCategoryQuiz = []; 
  var categoryQuizId = getNewCategoryQuizId(categoryName);
  arrayCategoryQuiz.push(categoryQuizId);
  console.log("Insert a new game ..." + gameId);
  GameCategoryQuizId.insert({"gameId": gameId, "category": arrayCategoryQuiz});
  return categoryQuizId.quizId[0];
}

var getNewQuizIdForCategory = function(gameId, usedQuiz, categoryName) {
  /* usedQuiz is an array of {"category": categoryName, "quizId": [...]} */
  var found = usedQuiz.find((cat) => cat.category === categoryName);
  if (!found) {
    var categoryQuizId = getNewCategoryQuizId(categoryName);  /* User select new category */
    usedQuiz.push(categoryQuizId);
    return categoryQuizId.quizId[0];
  }
  var allQuizInCategory = getQuizFromCategory(categoryName);
  var newQuiz = allQuizInCategory.diff(found.quizId);
  let quizId = newQuiz[ getRandomIndex(newQuiz.length) ];
  found.quizId.push(quizId);
  GameCategoryQuizId.update({"gameId": gameId}, {$set: {"category": usedQuiz}});
  return quizId;
}

QuizList.prototype.getNewQuizIdForGame = function(gameId, categoryName) {
  var existingGame = GameCategoryQuizId.findOne({"gameId": gameId});
  if (!existingGame) {
    return getNewGameQuizId(gameId, categoryName);
  }
  return getNewQuizIdForCategory(gameId, existingGame.category, categoryName);
}

var getQuizFromCategory = function(categoryName) {
  /* Return array of quiz IDs in the given categoryName */
  var found = categories.find((cat) => cat.category === categoryName);
  if (found) return found.quizId
  else return null;
}

QuizList.prototype.getQuizFromCategory = function(categoryName) {
  return getQuizFromCategory(categoryName);
}
