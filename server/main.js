import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import moment from 'moment';

Meteor.startup(() => {
  // We need to get quiz and questions on server side due to CORS limitation on client side.
  var quizList = new QuizList('quiz_list.json');  
  console.log("quizList.initializeQuizCollection");

/*
  QuizCollection.remove({});
  CategoryQuizCollection.remove({});
*/

  quizList.initializeQuizCollection();
  var categories = getAllCategories();
  console.log("All uniq categories: " + categories);
  var quizType = getDistinct('quizType', QuizCollection);
  console.log("All Quiz Types: " + quizType);

/*
  var categoryQuiz = quizList.getQuizFromCategory("HEALTH_AND_MEDICINE");
  if (categoryQuiz) {
    var testArr = [6322,6286,4549,4560,5531,4573,5355,4506,4515, 100000];
    console.log("HEALTH_AND_MEDICINE, quizIDs: " + JSON.stringify(categoryQuiz));
    console.log("Diff array: " + JSON.stringify(categoryQuiz.diff((testArr))) );
  }
*/

  var gameId = getNewGameId();
  console.debug("Game ID: " + getNewGameId());
  var quizId = quizList.getNewQuizIdForGame(gameId, "HEALTH_AND_MEDICINE");
  console.debug("HEALTH_AND_MEDICINE, quizId: " + quizId);

  quizId = quizList.getNewQuizIdForGame(gameId, "HEALTH_AND_MEDICINE");
  console.debug("HEALTH_AND_MEDICINE, next quizId: " + quizId);

  var allQuiz = QuizCollection.find({"mainCategory": "HEALTH_AND_MEDICINE"}).fetch();
  for (ii = 0; ii < allQuiz.length; ii++)
    console.debug("Quiz: " + JSON.stringify(allQuiz[ii]));

  // console.debug("HEALTH_AND_MEDICINE number of quizzes" + allQuiz.length);
  getGames('qhuynh');

  var noMatch = checkGame('game name', 'user name');
  // if (noMatch) console.log('checkGame, noMatch is ok');

  var match = checkGame('Demo game', 'user name');
  console.debug("checkGame: " + JSON.stringify(match));

  match = checkGame('Demo game', 'qhuynh');
  // console.debug("checkGame: " + JSON.stringify(match));

/*
  let user = {gameName:"demo",quizId:4689,player:"quanchuynh",question:8,isCorrect:false};
  console.log("All answer question 8: " + allPlayerAnswered(user));
  user.question = 9;
  console.log("All answer question 9: " + allPlayerAnswered(user));
*/
  let found = Meteor.users.find();
  if (found) {
    let users = found.fetch();  
    users.map((u) => {
      if (u.services.resume.loginTokens.length)
        console.log("User: " + u.username + " is in");
     });
  }

});

