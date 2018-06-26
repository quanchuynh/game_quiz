import React from 'react';
import './JoinGameNotification.css'; 
import { withTracker } from 'meteor/react-meteor-data';

const JoinGameNotification = (props) => {
  let options = props.opts, joinCount = props.games.length,
      notifyClass = joinCount ? "notification" : "nojoin";
  return (
    <div className={notifyClass} data-count={joinCount}></div>
  );
};

export default withTracker( ({currentUser}) => {
  /* Make the game name reactive. So new names are available w/o refresh. */
  var gameNames = [];
  let userName = currentUser.username;
  var orCodintion = {$or: [{player1: userName}, {player2: userName}, {player3: userName}]};
  var condition = {$and: [{active: true}, orCodintion]};
  match = CreatedGame.find(condition);
  if (match) {
    var matches = match.fetch();
    for (ii = 0; ii < matches.length; ii++) {
      gameNames[ii] = matches[ii].name;
    }
  }
  return {
    games: gameNames
  }
})(JoinGameNotification);

