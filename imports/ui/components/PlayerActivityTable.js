import React, { Component } from 'react';

class PlayerActivityTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerActivities: null
    }
  }

  componentDidMount() {
    this.remoteCall();  /* after render() had been called */
  }

  remoteCall( ) {
    Meteor.call(this.props.remoteCall, this.props.gameName, (err, ret) => {
      console.log("PlayerActivityTable, remote: " + JSON.stringify(ret));
      this.setState({playerActivities: ret});
    });
  }

  render() {
    let activity = this.state.playerActivities;
    let tableStyle = {color: "#005780", lineHeight: "1.2", fontStyle: "normal", fontSize: "12px"};
    return (
      this.state.playerActivities ? 
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

export default PlayerActivityTable;
