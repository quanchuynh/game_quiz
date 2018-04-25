import { Meteor } from 'meteor/meteor';
import axios from 'axios';

Meteor.startup(() => {
  // We need to get quiz and questions on server side due to CORS limitation on client side.
  var quizList = new QuizList('quiz_list.json');  
  console.log("quizList.initializeQuizCollection");

/*
  QuizCollection.remove({});
  CategoryQuizCollection.remove({});
*/

  quizList.initializeQuizCollection();
  var categories = getDistinct("mainCategory", QuizCollection);
  console.log("All uniq categories: " + categories);
  var quizType = getDistinct('quizType', QuizCollection);
  console.log("All Quiz Types: " + quizType);
});

