import React, { Component } from 'react';

class GameResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawFinalResult: null
    }
  }

  componentDidMount() {
   console.log("GameResult mounted");
    this.remoteCall();  /* after render() had been called */
  }

  remoteCall( ) {
    console.log("GameResult, call: " + this.props.remoteCall + ', parameter: ' + this.props.gameName);
    Meteor.call(this.props.remoteCall, this.props.gameName, (err, ret) => {
      console.log("GameResult: " + JSON.stringify(ret));
      this.setState({rawFinalResult: ret});
    });
  }

  render() {
    let ret = this.state.rawFinalResult,
        results = ret? ret.results : '',
        players = ret? results[0].players : '';
    let tableStyle = {color: "#005780", lineHeight: "1.2", fontStyle: "normal", fontSize: "12px"};
    return (
      this.state.rawFinalResult ? 
      <div>
        <h5 style={{color: "#005780", textAlign: "center"}}>Game: {ret.gameName}</h5>
        <table className="gameResult" style={tableStyle}>
          <thead>
          <tr className="gameResultHeader" style={tableStyle}>
             <th>Quiz</th>
             { players.map((player, i) => (<th key={i}>{player.player} got questions</th>)) }
             { players.map((player, i) => (<th key={i}>{player.player}'s Score</th>)) }
          </tr>
          </thead>
          <tbody>
          {
            results.map((result, i) => (
              <tr className="gameResultBody" key={i}>
                 <th>{result.title}</th>
              { result.players.map((player, ii) => (<td key={ii}>
                   {JSON.stringify(player.questions).replace(/\[/g, '').replace(/\]/g, '')}</td>)) }
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
