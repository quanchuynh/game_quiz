Future = Npm.require('fibers/future');

CategoryQuiz = function(cateogry, gameId) {
  this.category = cateogry;
  this.allQuizId = [];    /* all quiz IDs belong to this categories. */
  this.usedId = [];       /* ids already used for this game. */
  this.gameId = gameId;
}

CategoryQuiz.prototype.cloneCategory = function(gameId) {
  // Clone this object to be used for different game
}

CategoryQuiz.prototype.findWhere = function(nvPair) {
  return _.findWhere(this.list, nv_pair);
}

CategoryQuiz.prototype.getCategoryQuiz = function(quizId) {
  return this.list; 
}

