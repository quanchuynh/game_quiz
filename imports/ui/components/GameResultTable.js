import React, { Component } from 'react';

class GameResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawFinalResult: null
    }
  }

  componentDidMount() {
    this.remoteCall();  /* after render() had been called */
  }

  remoteCall( ) {
    Meteor.call(this.props.remoteCall, this.props.gameName, (err, ret) => {
      console.log("GameResult: " + JSON.stringify(ret));
      this.setState({rawFinalResult: ret});
    });
  }

  render() {
    let ret = this.state.rawFinalResult,
        results = ret? ret.results : '',
        players = ret? results[0].players : '';
    return (
      this.state.rawFinalResult ? 
      <div>
        <h5 style={{color: "#005780", textAlign: "center"}}>Game: {ret.gameName}</h5>
        <table className="gameResult" style={{color: "#005780", lineHeight: "1.2"}}>
          <thead>
          <tr className="gameResultHeader" style={{color: "#005780", lineHeight: "1.2"}}>
             <th>Quiz</th>
             { players.map((player, i) => (<th key={i}>{player.player}'s correct questions</th>)) }
             { players.map((player, i) => (<th key={i}>{player.player}'s Score</th>)) }
          </tr>
          </thead>
          <tbody>
          {
            results.map((result, i) => (
              <tr className="gameResultBody" key={i}>
                 <th>{result.title}</th>
              { result.players.map((player, ii) => (<td key={ii}>{JSON.stringify(player.questions)}</td>)) }
              { result.players.map((player, ii) => (<td key={ii}>{player.score}</td>)) }
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

export default GameResultTable;
