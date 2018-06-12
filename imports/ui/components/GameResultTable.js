import React, { Component } from 'react';

class GameResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initValue: 0
    }
  }

  render() {
    let ret = this.props.result,
        results = ret.results,
        players = results[0].players;
    console.log("GameResult: " + JSON.stringify(ret));    
    return (
      <div>
        <h5>{ret.gameName}</h5>
        <table className="gameResult">
          <tr className="gameResultHeader">
             <th>Quiz</th>
             {
               players.map((player, i) => (<th key={i}>{player.player}'s correct question</th>))
             }
          </tr>
          {
            results.map((result, i) + (
              <tr className="gameResultBody">
                 <th>{result.title}</th>
              {
                result.players.map((player, ii) => (<td key={ii}>{JSON.stringify(player.questions)}</td>))
                  /* <td>{player.score}</td> */
              }
              </tr>
            ))
          }
        </table>
      </div>
    )
  }
}

export default GameResultTable;
