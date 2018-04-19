var quizList = new QuizList('quiz_list.json');

Meteor.methods({
  getQuiz: function(quizId) {
     return quizList.getQuiz(quizId);
  },

  getQuestion: function(quizId) {
     return quizList.getQuestion(quizId);
  }

});
