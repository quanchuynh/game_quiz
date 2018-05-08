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
    return quizList.getNewQuizIdForGame(gameId, category);
  },

  getAllQuizIn: function(category) {
    cursor = QuizCollection.find({"mainCategory": category});
    if (cursor) return cursor.fetch();
    console.log("Could not find quiz in category: "  + category);
    throw (new Meteor.Error(1, "Could not find quiz in category: "  + category));
  }

});

getAllCategories = function() {
  if (categories.length === 0) 
    categories = getDistinct("mainCategory", QuizCollection);
  return categories;
}

