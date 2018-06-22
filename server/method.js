var exec = Npm.require('child_process').exec;
var syncExec = Meteor.wrapAsync(exec);
var quizList = new QuizList('quiz_list.json');
var categories = [];
var categoriesIdMap = [];
var testMode = true;
var testQuizId = 4856;
var joinGameUrl = "http://aws-gateway.ad.eb.com:8081/join-game";
const maxEarningPerPlayer = 1000;  /* $1000 */
const percentEarnCompleteQuiz = 0.30;          /* 30% complete all quizzes will earn 30% */
const percentEarnCorrectAnswerRatio = 0.70;   /* Earn 70% */
const totalQuizCount = 900;

Meteor.methods({
  getTopPlayers: function() {
    /* Top 5 earners in descending order. */
    return UserActivities.find({}, {sort: {earning: -1}, limit: 5}).fetch();
  },

  getPlayerActivities: function(gameName) {
    let match = CreatedGame.find({name: gameName});
    if (match) {
      console.log("getPlayerActivities: " + gameName); 
      var orCondintion = {$or: [{username: match.player1}, {username: match.player2}, {username: match.player3}]};
      return UserActivities.find(orCondintion, {sort: {earning: -1}, limit: 3}).fetch();
    }

  },

  getResultDetail : function(param) {
    let gameName = param.gameName, quizId = param.quizId;
    let res = getQuizResultDetail(gameName, quizId);
    // return {gameName: gameName, quizId: res.title, players: res.players, winner: res.winner};
    console.log("getResultDetail: " + JSON.stringify(res));
    return {gameName: gameName, results: [res], ok: true};
  },

  getFinalResult: function(gameName) {
    let gql = GameQuizList.findOne({gameName: gameName});
    if (gql) {
      let qList = gql.quizList;
      let results = qList.map( (quizId) => (getQuizResultDetail(gameName,quizId)) );
      return {gameName: gameName, results: results, ok: true};
    }
    return {ok: false, errorMessage: "Could not find " + gameName + " in game quiz list."};
  },

  submitAnswer: function(user) {
    console.log("submitCorrectAnswer: " + JSON.stringify(user));
    match = TrackCorrectPlayer.findOne({gameName: user.gameName, quizId: user.quizId, 
                               player: user.player, question: user.question});
    if (match) return;   /* Anwser already submitted for this question */

    if (user.isCorrect) {
      /* Stop other user from answer this question. */
      TrackQuizQuestion.update({gameName: user.gameName, quizId: user.quizId}, {$set: {countDown: 0}});
    }
    TrackCorrectPlayer.insert(user);
    if (allPlayerAnswered(user)) {
      /* All are wrong, switch to new question. */
      TrackQuizQuestion.update({gameName: user.gameName, quizId: user.quizId}, {$set: {countDown: 0}});
    }
  },

  getActiveGames: function() {
    return getActiveGames();
  },

  joinGame: function(gameName, userName) {
    return joinGame(gameName,userName);
  },

  getMatchGames: function(userName) {
    return getGames(userName);
  },

  insertNewGame: function(game) {
    /* Insert new game. Initially wait for players. */
    var waitList = [game.player1, game.player2];
    waitList = game.player3 == null ? waitList : [...waitList, game.player3 ];
    game.waitList = waitList;
    var randomCategory = getRandomCategory();   /* First quiz is pre-selected from random category. */
    var quizId = getCategoryQuizId(randomCategory, game.name);
    game.currentQuizId = quizId;
    game.currentQuizNumber = 1;
    game.quizComplete = false;
    if (testMode) game.currentQuizId = testQuizId;    /* quiz ID for easy testing. */
    CreatedGame.insert(game);
    createQuizQuestionTracker(game);
    notifyPlayers(game);
    return true;
  },

  checkGame: function(gameName, userName) {
    return checkGame(gameName, userName);
  },

  checkGameName: function(name) {
    if (CreatedGame.findOne({name: name})) {
      let ii = 1;
      let recommendedName = name + ' ' + ii++;
      while (CreatedGame.findOne(recommendedName)) {
        recommendedName =  name + ' ' + ii++;
      }
      return {found: true, recommend: recommendedName};
    }
    return {found: false, recommend: ''};
  },

  checkUserName(userName) {
    if (Meteor.users.findOne({username: userName})) return true;
    return false;
  },

  getUsers: function(partialName) {
    return getUsers(partialName);
  },

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
    /* Winner selected a category. Generate a new quizId for this game. */
    var quizId = getCategoryQuizId(category, gameId);
    var match = CreatedGame.findOne({name: gameId});
    if (match) {
      match.currentQuizNumber++;
      match.currentQuizId = quizId;
      createQuizQuestionTracker(match);
      trackQuizQuestion(match);
      /* Client side begin to see new quiz here. Game already started, no game countDown. */
      CreatedGame.update({name: gameId}, 
           {$set: {currentQuizId: quizId, currentQuizNumber: match.currentQuizNumber, 
                   quizComplete: false, categorySelector: false, countDown: 0}});
      let check = CreatedGame.findOne({name: gameId});
      console.log("New quiz for game: " + gameId + ", " + JSON.stringify(check));
    }
    return quizId;
  },

  getAllQuizIn: function(category) {
    cursor = QuizCollection.find({"mainCategory": category});
    if (cursor) return cursor.fetch();
    console.log("Could not find quiz in category: "  + category);
    throw (new Meteor.Error(1, "Could not find quiz in category: "  + category));
  },

  resetPasswordByEmail: function(email) {
    console.log("Email: " + email + " resets password");
    var id = Accounts.findUserByEmail(email);
    if (id) {
      var username = id.username;
      if (username) { 
        console.log("Reset password for user name: " + username);
        var password = randomId();
        Accounts.setPassword(id, password);
        console.log("Email address in system: " + id.emails[0].address);
        sendMail(email, "User account " + username + " information", 
                 "username: " + username + ", password is: " + password);
      }
    }
    else {
      console.log('No matching email found');
      throw (new Meteor.Error(1, 'Email is not in signed-up list. Signuup (above) to create a user first.'));
    }
  },

  changeUserPassword: function(userName, password) {
    console.log("User name: " + userName + ", password: " + password);
    var id = Accounts.findUserByUsername(userName);
    Accounts.setPassword(id, password);
    console.log("Set new password for user: " + userName);
  },

  createUserAccount: function(email, userName) {
    var password = randomId();
    console.log("Created user: " + userName + ", Random password: " + password);
    Accounts.createUser({email: email, username: userName, password: password});
    sendMail(email, "User account " + userName + " information", "Your password is: " + password);
  }
});

sumQuestionCount = function(accu, val) {
  return accu + val;
}

updateOnePlayerEarning = function(player) {
  let match = UserActivities.findOne({username: player});
  if (match) {
    let completeQuizRatio = match.quizIds.length / totalQuizCount,
        correctAnswerRatio = match.correctAnswers / match.questionViews;
    completeQuizRatio = completeQuizRatio > 1 ? 0.5 : completeQuizRatio;  /* protection from error */
    correctAnswerRatio = correctAnswerRatio > 1 ? 0.5 : correctAnswerRatio;
    let quizCompleteEarning = completeQuizRatio * maxEarningPerPlayer * percentEarnCompleteQuiz,
        correctAnswerEarning = correctAnswerRatio * completeQuizRatio * maxEarningPerPlayer * percentEarnCorrectAnswerRatio,
        earning = quizCompleteEarning + correctAnswerEarning;
        earning = Math.round(earning * 100) / 100;
    UserActivities.update({username: player}, {$set: {earning: earning}});
  }
}

updateEarning = function(game) {
  updateOnePlayerEarning(game.player1);
  updateOnePlayerEarning(game.player2);
  if (game.playerCount == 3)
    updateOnePlayerEarning(game.player3);
}

recordPlayerActivities = function(gameName) {
  /* Use case: once a game complete, update players' activities. */
  game = CreatedGame.findOne({name: gameName}); 
  if (!game) return;
  if (!game.gameComplete) return;
  if (game.computed) return;

  CreatedGame.update({name: gameName}, {$set: {computed: true}}); 
  let gql = GameQuizList.findOne({gameName: gameName});
  if (gql) {
    let qList = gql.quizList, 
        questions = qList.map((quizId) => (quizList.getQuestion(quizId).length));
    var totalQuestionCount = questions.reduce(sumQuestionCount);
    console.log("recordPlayerActivities: " + totalQuestionCount);
    qList.map( (quizId) => {
      let userScore = getResultDetail(gameName, quizId);
      userScore.map((usc) => {
        var userAct = {username: usc.player, correctAnswers:0, questionViews: 0, quizIds:[]};
        var match = UserActivities.findOne({username: usc.player});
        if (match) userAct = match;
        userAct.correctAnswers += usc.score;
        userAct.questionViews += quizList.getQuestion(quizId).length;
        if (! userAct.quizIds.find((id) => { return id == quizId }) ) {
          userAct.quizIds.push(quizId);  /* new quiz for this user. */
        }
        match ? 
          UserActivities.update({username: usc.player}, {$set: 
             {correctAnswers: userAct.correctAnswers, 
              questionViews: userAct.questionViews, 
              quizIds: userAct.quizIds}})
          :
          UserActivities.insert(userAct)
      }) 
    });
    updateEarning(game);
  }
}

allPlayerAnswered = function(user) {
  /* Use case: if all players already answered this question. Switch to next. */
  let ret = false,
      game = CreatedGame.findOne({name: user.gameName}); 
  if (game) {
    let answers = TrackCorrectPlayer.find({gameName: user.gameName, quizId: user.quizId, question: user.question});
    if (answers) {
      return answers.fetch().length == game.playerCount;
    }
  }
  return ret;
}

getQuizResultDetail = function(gameName, quizId) {
  let quiz = quizList.getQuiz(quizId);
  let questionData = quizList.getQuestion(quizId);
  let title = quiz.title + " (" + quiz.mainCategory.replace(/_/g, ' ') + ")";
  let userScore = getResultDetail(gameName, quizId);
  const maxScore = Math.max(...userScore.map(o => o.score));
  let pl = userScore.find((usc) => { return usc.score == maxScore });
  return {title: title, players: userScore, winner: pl.player, numOfQuestions: quiz.numOfQuestions};
}

getQuizWinner = function(gameName, quizId) {
  var userScore = getResultDetail(gameName, quizId);
  const maxScore = Math.max(...userScore.map(o => o.score));
  let pl = userScore.find((usc) => { return usc.score == maxScore });
  return pl.player;
}

getResultDetail = function(gameName, quizId) {
  var userScore = [];
  var game = CreatedGame.findOne({name: gameName});
  if (game) {
    userScore.push({player: game.player1, score: 0, questions: []});
    userScore.push({player: game.player2, score: 0, questions: []});
    if (game.playerCount == 3)
      userScore.push({player: game.player3, score: 0, questions: []});
  }
  var match = TrackCorrectPlayer.find({gameName: gameName, quizId: quizId});
  if (match) { /* possible that no player score yet */
    var correctPlayer = match.fetch();
    for (ii = 0; ii < correctPlayer.length; ii++) {
      if (!correctPlayer[ii].isCorrect) continue;
      let pl = userScore.find((usc) => { return usc.player == correctPlayer[ii].player });
      if (pl) {
        pl.score++;
        pl.questions.push(correctPlayer[ii].question + 1);
      }
      else {
        var questions = [];
        questions.push(correctPlayer[ii].question + 1);
        userScore.push({player: correctPlayer[ii].player, score: 1, questions: questions});
      }
    }
  }
  return userScore;
}

createQuizQuestionTracker = function(game) {
  var quizId = game.currentQuizId;
  let questCount = quizList.getQuestion(quizId).length;
  TrackQuizQuestion.insert({gameName: game.name, quizId: quizId, quizNumber: game.currentQuizNumber, 
                            currentQuestion: 0, lastQuestion: questCount - 1,
                            countDown: 10, quizComplete: false, quizStartTime: 5});
  var gql = GameQuizList.findOne({gameName: game.name});
  if (gql) {
    gql.quizList = [...gql.quizList, quizId];
    GameQuizList.update({gameName: game.name}, {$set: {quizList: gql.quizList}});
  }
  else {
    let qList = [];
    qList.push(quizId);
    GameQuizList.insert({gameName: game.name, quizList: qList}); 
  }
}

trackQuizQuestion = function(game) {
  var quizId = game.currentQuizId;
  quizStartTime = 5;
  tInterval = Meteor.setInterval(() => {
    quizStartTime--;
    TrackQuizQuestion.update({gameName: game.name, quizId: quizId}, {$set: {quizStartTime: quizStartTime}});
    if (quizStartTime <= 0) {
      Meteor.clearInterval(tInterval);
      startQuestionTracker(game);
    }
  }, 1000);
}

nextCategoryCountDown = function(gameName, quizId) {
  categoryStartTime = 5;
  tInterval = Meteor.setInterval(() => {
    categoryStartTime--;
    TrackQuizQuestion.update({gameName: gameName, quizId: quizId}, {$set: {categoryStartTime: categoryStartTime}});
    if (categoryStartTime <= 0) {
        categoryStartTime = 0;
        Meteor.clearInterval(tInterval);
        let winner = getQuizWinner(gameName, quizId);
        CreatedGame.update({name: gameName, currentQuizId: quizId}, {$set: {categorySelector: winner}}); 
    }
  }, 1000);
}

getCategoryQuizId = function(category, gameId) {
  var quizId = quizList.getNewQuizIdForGame(gameId, category);
  console.log("getCategoryQuizId, quizId: " + quizId + ", category: " + category); 
  return quizId;
}

startQuestionTracker = function(game) {
  /* Expire each question in 10 seconds and roll to the next question
   * countDown can be update outside of this function t0 <= 0 in which case the current question
   * expires immediately. 
   */
  let currentQuestion = 0;
  tInterval = Meteor.setInterval(() => {
        /* currentQuizId */
    TrackQuizQuestion.update({gameName: game.name, quizId: game.currentQuizId}, {$inc: {countDown: -1}});
    let trackQuiz = TrackQuizQuestion.findOne({gameName: game.name, quizId: game.currentQuizId});
    if (!trackQuiz) {
      console.log("ERROR: Could not find track_quiz for gameName: " + game.name + ", quizId: " + game.currentQuizId);
    }
    let countDown = trackQuiz.countDown, lastQuestion = trackQuiz.lastQuestion;
    currentQuestion = trackQuiz.currentQuestion;
    if (countDown <= 0) {
      if (currentQuestion == lastQuestion) {
        Meteor.clearInterval(tInterval);
        TrackQuizQuestion.update({gameName: game.name, quizId: game.currentQuizId},
                             {$set: {quizComplete: true} });
        var match = CreatedGame.findOne({name: game.name});
        if (match) {
          console.log("Quiz complete, game name: " + game.name + ", quiz ID: " + game.currentQuizId);
          CreatedGame.update({name: game.name}, {$set: {quizComplete: true}});
          if (game.currentQuizNumber == game.count) {
            CreatedGame.update({name: game.name}, {$set: {gameComplete: true, active: false}});
            recordPlayerActivities(game.name);
          }
        }
        nextCategoryCountDown(game.name, game.currentQuizId);
        return;
      }
      currentQuestion++;
      TrackQuizQuestion.update({gameName: game.name, quizId: game.currentQuizId},
                               {$set: {currentQuestion: currentQuestion, countDown: 10}}); 
    }
  }, 1000);
}

joinGame = function(gameName, userName) {
  var match = CreatedGame.findOne({name: gameName});
  if (!match) {
    return {ok: false, errorMessage: "Could not find " + gameName + " in game list"};
  }
  console.log("Join " + gameName + ", by " + userName);

  var checkResult = checkGame(gameName, userName);
  if (!checkResult.ok) return checkResult;

  var waitList = match.waitList;
  if (!waitList.includes(userName)) {
    return {ok: false, errorMessage: "Player " + userName + " already joined", errorType: 'joined'};
  }
  waitList = waitList.filter(e => e != userName);
  console.log("Joined User: " + userName + ", waits: " + JSON.stringify(waitList));

  CreatedGame.update({_id: match._id}, {$set: {waitList: waitList}}, {$inc: {joinCount: 1}});
  if (waitList.length == 0) {
    var countDown = 5;
    CreatedGame.update({_id: match._id}, {$set: {countDown: countDown}});
    tInterval = Meteor.setInterval(() => {
      countDown--;
      CreatedGame.update({_id: match._id}, {$set: {countDown: countDown}});
      if (countDown <= 0) {
        Meteor.clearInterval(tInterval);
        CreatedGame.update({_id: match._id}, {$set: {categorySelector: false}});
        /* First quiz begins, let track questions */
        trackQuizQuestion(match);
      }
    }, 1000);
  }
  return {ok: true, errorMessage: "None", waitList: waitList};
}

checkGame = function(gameName, userName) {
  var match = CreatedGame.findOne({name: gameName}); /* gameName is unique */
  if (!match) return null;
  var orCodintion = {$or: [{player1: userName}, {player2: userName}, {player3: userName}]};
  var condition = {$and: [{name: gameName}, orCodintion]}; 
  match = CreatedGame.findOne(condition); /* gameName is unique */
  if (!match) {
    return {ok: false, errorMessage: 'User: "' + userName + '" is not a player in game "' + gameName};
  }
  if (!match.active) {
    return {ok: false, errorMessage: 'Game: "' + gameName + '" is not active'};
  }
  return {ok: true, errorMessage: 'No Error'};
}

sumQuestionQuizList = function(accumulator, quizId) {
  return accumulator + quizList.getQuestion(quizId).length;
}

updatePlayerActivities = function(gameName) {
  /* When a game complete, update activities so we can calculate award and ranking. */
  let match = CreatedGame.findOne(gameName);
  if (match) {
    var players = [];
    players.push(match.player1); 
    players.push(match.player2); 
    if (match.playerCount == 3) players.push(match.player3);
    let gql = GameQuizList.findOne({gameName: gameName});
    if (gql) {
      let qList = gql.quizList;
      let questionCount = qList.reduce(sumQuestionQuizList);
      let results = qList.map( (quizId) => (getQuizResultDetail(gameName,quizId)) );
    }
  }
}

getActiveGames = function() {
  /* list. */
  var names = [];
  match = CreatedGame.find({active: true});
  if (match) {
    var matches = match.fetch();
    for (ii = 0; ii < matches.length; ii++) {
      names[ii] = matches[ii].name; 
    }
  }
  console.log("getActiveGames Games: " + JSON.stringify(names));
  return names;
}

getGames = function(userName) {
  /* Support join game. Use must be in the player list. */
  var names = [];
  match = CreatedGame.find({$or: [{player1: userName}, {player2: userName}, {player3: userName}]});
  if (match) {
    var matches = match.fetch();
    for (ii = 0; ii < matches.length; ii++) {
      names[ii] = matches[ii].name; 
    }
  }
  console.log("Games: " + JSON.stringify(names));
  return names;
}

getAllCategories = function() {
  if (categories.length === 0) 
    categories = getDistinct("mainCategory", QuizCollection);
  return categories;
}

getUsers = function(partialName) {
  var regexString = '.*' + partialName + '.*';
  var match = Meteor.users.find({username: {$regex: regexString}});
  if (match) {
    var users = match.fetch(), players = [];
    for (ii = 0; ii < 5 && ii < users.length; ii++) players[ii] = users[ii].username;
    return players;
  }
  return [];
}


function randomId()
{
  var text = "C_";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 7; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

getRandomCategory = function() 
{
  var categories = getAllCategories();
  return categories[Math.floor(Math.random() * categories.length)];
}

notifyPlayers = function(game) {
  var receivers = '';
  for (ii = 0; ii < game.waitList.length; ii++) {
    if (game.waitList[ii] != game.owner) {
      let player = Meteor.users.findOne({username: game.waitList[ii]});
      if (player) {
        console.log("Player: " + JSON.stringify(player));
        receivers = receivers + ' ' + player.emails[0].address;
      }
    }
  }
  let subject = "Encyclopedic Brain, Join Game Inviation",
      body = game.owner + " invites you to join game " + game.name + " on " + joinGameUrl;
  sendMail(receivers, subject, body); 
}

function sendMail(receivers, subject, body) {
  // Send mail using existing SMTP mailx in runtime environment (make sure mailx is setup)
  // receivers: string of email addresses separated by space
  // cat $MAIL_HEADER_TEMP $MAIL_CONTENT_FILE | mailx -s "$subject" qhuynh@eb.com
  var command = 'echo ' + body + ' | mail -s "' + subject + '" ' + receivers;
  console.log("Run: " + command);
  child = syncExec(command, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if(error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

function DbError(message) {
  this.name = 'DbError';
  this.message = message || 'Error executing SQL';
}

