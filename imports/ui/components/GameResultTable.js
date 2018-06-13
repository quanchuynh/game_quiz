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
        <h5>{ret.gameName}</h5>
        <table className="gameResult">
          <thead>
          <tr className="gameResultHeader">
             <th>Quiz</th>
             {
               players.map((player, i) => (<th key={i}>{player.player}'s correct question</th>))
             }
          </tr>
          </thead>
          <tbody>
          {
            results.map((result, i) => (
              <tr className="gameResultBody" key={i}>
                 <th>{result.title}</th>
              {
                result.players.map((player, ii) => (<td key={ii}>{JSON.stringify(player.questions)}</td>))
                  /* <td>{player.score}</td> */
              }
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
