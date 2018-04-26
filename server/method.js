var quizList = new QuizList('quiz_list.json');
var categories = [];
var categoriesIdMap = [];

Meteor.methods({
  getQuiz: function(quizId) {
     return quizList.getQuiz(quizId);
  },

  getQuestion: function(quizId) {
     return quizList.getQuestion(quizId);
  },

  getCategories: function() {
    return getAllCategories();
  },

  getCategoryQuizId: function(category, gameId) {
    return 0;
  }
});

getAllCategories = function() {
  if (categories.length === 0) 
    categories = getDistinct("mainCategory", QuizCollection);
  return categories;
}

