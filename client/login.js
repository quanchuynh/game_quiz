import { Template } from 'meteor/templating';
import './template/login.html';
import CreateGame from '../imports/ui/pages/CreateGame';
import JoinGame from '../imports/ui/pages/JoinGame';
import AddPlayer from '../imports/ui/pages/AddPlayer';
import WatchGame from '../imports/ui/pages/WatchGame';


Template.signup.events({
    'click #sign_up': function (evt, template) {
        var email = template.find('#su-email').value;
        var username = template.find('#su-username').value;
        evt.preventDefault();
/*
        if (!Emails.findOne({"email": email})) {
          alert("Email: " + email + " not authorized to create account");
          return;
        }
*/
        console.log("Call remote createUserAccount: " + username);
        Meteor.call('createUserAccount', email, username, function(err, result) {
          if (err) { 
            alert("Server side error: " + err); 
          }
          else
            alert("Created User name " + username + ", check your email for password");
        });

    }
});

Template.login.events({
    'click #login': function (evt, template) {
        evt.preventDefault();
        var username = template.find('#li-username').value;
        console.log("Login with password, username: " + username); 
        Meteor.loginWithPassword(
            username, template.find('#li-password').value
            , (e) => {
                if (e) {
                  alert("Log in error: " + e + ", user: " + username);
                  return
                }
                SignInTitle = 'Log Out';
              }
        );
        
    },

    'click #reset_password': function (evt, template) {
        evt.preventDefault();
        var email = template.find('#li-username').value;
        if (!email) {
          alert("Enter your user name or email");
          return;
        }
        Meteor.call('resetPasswordByEmail', email, function(err, result) {
          if (err) { alert(err); }
          return;
        });
    }, 

    'click #login-signup': function (evt, template) {
       console.log("Swith to sign in");
       window.location.href = SignUpPath; 
    }
});

Template.change_password.events({
    'click #change_password': function (evt, template) {
        evt.preventDefault();
        var newPassword = template.find('#new-password').value;
        var confirmPassword = template.find('#confirm-password').value;
        var userName = $('#change_password').attr('name');
        if (newPassword != confirmPassword) {
          alert("New and confirmed passwords are different. Password not changed !!!");
          return;
        }
        Meteor.call('changeUserPassword', userName, newPassword, function(err, result) {
          if (err) { alert("Server side error: " + err); }
          return;
        });
    }  
});

Template.logout.events({
    'click #logout': function (evt, template) {
        evt.preventDefault();
        Meteor.logout();
    }
});

Template.signupLogin.helpers({
  reactComponent: function(component, nameEntered) {
    return (component == nameEntered);
  }
});

Template.create.helpers({
  createGame() { 
    return CreateGame; 
  } 
});

Template.join.helpers({
  joinGame() { 
    return JoinGame; 
  } 
});

Template.add.helpers({
  addPlayer() { 
    return AddPlayer; 
  } 
});

Template.watch.helpers({
  watchGame() { 
    return WatchGame; 
  } 
});

