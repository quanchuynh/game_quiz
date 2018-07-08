import React from 'react';
import './JoinGameNotification.css'; 
import { withTracker } from 'meteor/react-meteor-data';
import DropdownNavItem from './DropdownNavItem';

const JoinGameNotification = (props) => {
  let options = props.opts, joinCount = props.games.length,
      notifyClass = joinCount ? "notification" : "nojoin", 
      games = props.games,
      selectedStyle = {backgroundColor: "#ddd"}, 
      unselectStyle = {backgroundColor: "#f9f9f9"},
      noStyle = {color: "black"}; 
  let dropdown = [];
  for (ii = 0; ii < joinCount; ii++) {
    let style = (ii === props.gameJoined) ? selectedStyle : unselectStyle;
    if (props.gameJoined == undefined) style = noStyle;
    dropdown.push({title: games[ii], link: 'join-game', style: style});
  }
  console.log("JoinGameNotification: " + JSON.stringify(dropdown) + ", games: " + JSON.stringify(games)); 
  console.log("JoinGameNotification, gameJoined: " + props.gameJoined);

  function handleClick(e) {
    e.preventDefault();
    if (props.gameJoined != undefined) {
      window.location.href = joinGamePath; 
      return;
    }
    let gameName = e.currentTarget.name;
    Meteor.call('joinGame', gameName, props.userName, (err, ret) => {
      if (!ret.ok) {
        alert(ret.errorMessage);
        return;
      }
      window.location.href = joinGamePath; 
    });
  }
      
  return (
         <span className="DropdownNavItem">
           <div className={notifyClass} data-count={joinCount}></div>
         {
         joinCount ?  
           <div className="DropdownNavItem-content">
           {
             dropdown.map((item, i) => (<a key={i} href={item.link} onClick={handleClick} name={item.title} style={item.style}> 
                                              join: {item.title} </a>))
           }
           </div>
         : <span/>
         }
         </span>
  );
};

export default withTracker( ({currentUser}) => {
  /* Make the game name reactive. So new names are available w/o refresh. */
  var gameNames = [], gameJoined = undefined;
  let userName = currentUser;
  var orCodintion = {$or: [{player1: userName}, {player2: userName}, {player3: userName}]};
  var condition = {$and: [{active: true}, orCodintion]};
  match = CreatedGame.find(condition);
  if (match) {
    var matches = match.fetch();
    for (ii = 0; ii < matches.length; ii++) {
      gameNames[ii] = matches[ii].name;
      var waitList = matches[ii].waitList;
      if (!waitList.includes(userName)) {
        gameJoined = ii;
        console.debug("userName: " + userName + " not in wait list: " + JSON.stringify(waitList));
      }
    }
  }
  return {
    games: gameNames,
    gameJoined: gameJoined,
    userName: currentUser
  }
})(JoinGameNotification);

