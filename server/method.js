var exec = Npm.require('child_process').exec;
var syncExec = Meteor.wrapAsync(exec);
var quizList = new QuizList('quiz_list.json');
var categories = [];
var categoriesIdMap = [];

Meteor.methods({
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

getAllCategories = function() {
  if (categories.length === 0) 
    categories = getDistinct("mainCategory", QuizCollection);
  return categories;
}

getUsers = function(partialName) {
  console.log("getUsers ...");
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

