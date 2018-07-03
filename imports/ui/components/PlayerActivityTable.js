import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class PlayerActivityTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerActivities: null
    }
  }

  render() {
    let activity = this.props.playerActivities;
    let tableStyle = {color: "#005780", lineHeight: "1.2", fontStyle: "normal", fontSize: "12px"};
    return (
      this.props.playerActivities ? 
      <div>
        <h5 style={{color: "#005780", textAlign: "center"}}>{this.props.tableTitle}</h5>
        <table style={tableStyle}>
          <thead>
          <tr style={tableStyle}>
             <th>Player</th>
             <th>Scores</th>
             <th># Total Questions</th>
             <th># Unique Quizzes Played</th>
             <th>Earning This Qt</th>
          </tr>
          </thead>
          <tbody>
          {
            activity.map((p, i) => (
              <tr key={i}>
              <td>{p.username}</td>
              <td>{p.score}</td>
              <td>{p.questionViews}</td>
              <td>{p.quizIds.length}</td>
              <td>${p.earning}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
      : <span/>
    )
  }
}

/* Need to be reactive otherwise game complete but user's activities are not up-to-date */

export default withTracker(({gameName, tableTitle}) => {
  let activities = null, match = CreatedGame.findOne({name: gameName});
  if (match) {
    var orCondintion = {$or: [{username: match.player1}, {username: match.player2}, {username: match.player3}]};
    activities = UserActivities.find(orCondintion, {sort: {earning: -1}, limit: 3}).fetch();
  }
  else if (gameName == 'topPlayers') {
    activities = UserActivities.find({}, {sort: {earning: -1}, limit: 5}).fetch(); 
    console.debug("PlayerActivityTable: " + JSON.stringify(activities));
  }

  return {
    playerActivities: activities,
    tableTitle: tableTitle 
  };
}) (PlayerActivityTable);

