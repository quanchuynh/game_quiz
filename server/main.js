import { Meteor } from 'meteor/meteor';
import axios from 'axios';

Meteor.startup(() => {
  // We need to get quiz and questions on server side due to CORS limitation on client side.
  var quizList = new QuizList('quiz_list.json');  
  var quiz = quizList.getQuiz(5011); /* 4472 */
  console.log("title: " + quiz.title);
  console.log("image: " + JSON.stringify(quiz.thumbnail));
  console.log("image: " + JSON.stringify(quiz));
  /*
           introduction: quizData.introduction,
           tags: quizData.keywords,
           questionCount: quizData.numOfQuestions,
           image: quizData.thumbnail,
           timer: quizData.seconds,
           questions: questionData
*/
  // console.log( "Question: " + JSON.stringify(quizList.getQuestion(5011)) );
});

