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

  var gameId = getNewGameId();
  console.debug("Game ID: " + getNewGameId());
  var quizId = quizList.getNewQuizIdForGame(gameId, "HEALTH_AND_MEDICINE");
  console.debug("HEALTH_AND_MEDICINE, quizId: " + quizId);

  quizId = quizList.getNewQuizIdForGame(gameId, "HEALTH_AND_MEDICINE");
  console.debug("HEALTH_AND_MEDICINE, next quizId: " + quizId);

  var allQuiz = QuizCollection.find({"mainCategory": "HEALTH_AND_MEDICINE"}).fetch();
  for (ii = 0; ii < allQuiz.length; ii++)
    console.debug("Quiz: " + JSON.stringify(allQuiz[ii]));

  recordPlayerActivities('d1');
  recordPlayerActivities('d2');
  var uActs = UserActivities.find();
  if (uActs) {
    console.log("User Activities: " + JSON.stringify(uActs.fetch()));
  }

  let found = Meteor.users.find();
  if (found) {
    let users = found.fetch();  
    users.map((u) => {
      if (u.services.resume.loginTokens.length)
        console.log("User: " + u.username + " is in");
     });
  }

});

