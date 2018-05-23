var exec = Npm.require('child_process').exec;
var syncExec = Meteor.wrapAsync(exec);
var quizList = new QuizList('quiz_list.json');
var categories = [];
var categoriesIdMap = [];

Meteor.methods({
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
    CreatedGame.insert(game);
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
    return quizList.getNewQuizIdForGame(gameId, category);
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
      throw (new Meteor.Error(1, 'Email is not in signed up list. Sign up (above) to create a user first.'));
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

joinGame = function(gameName, userName) {
  console.log("Join " + gameName + ", by " + userName);

  var match = CreatedGame.findOne({name: gameName});
  if (!match) {
    return {ok: false, errorMessage: "Could not find " + gameName + " in game list"};
  }

  console.log("Join " + gameName + ", by " + userName);

  var checkResult = checkGame(gameName, userName);
  if (!checkResult.ok) return checkResult;

  var waitList = match.waitList;
  if (!waitList.includes(userName)) {
    return {ok: false, errorMessage: "Player " + userName + " already joined"};
  }
  waitList = waitList.filter(e => e != userName);
  console.log("Joined User: " + userName + ", waits: " + JSON.stringify(waitList));
  CreatedGame.update({_id: match._id}, {$set: {waitList: waitList}}, {$inc: {joinCount: 1}});
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

