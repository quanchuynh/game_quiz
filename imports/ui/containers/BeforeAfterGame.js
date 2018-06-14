import React, { Component } from 'react';
import CountDownCircle from '../components/CountDownCircle';
import GameResultTable from '../components/GameResultTable';

class BeforeAfterGame extends Component {
  /* Render info before game start and after game completed. */
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      finalResult: {__html:  ''},
      rawFinalResult: {}
    };
    this.finalResult = {__html:  '<div>Init final result</div>'};
    this.formatQuizResult = this.formatQuizResult.bind(this); 
  }

  formatQuizResult(ret) {
    let content = '<span style="float: left"> Quiz: ' + ret.title + '</span><br/>' +
              ret.players.map((player) => ('<span style="float: left"><em>' + player.player + '</em> got '
              + player.score + ' questions: ' + JSON.stringify(player.questions) + '</span><br/>')) +
              '<span style="float: left"> Winner: ' + ret.winner + '</span></br>';
    return content;
  }

  render() {
    let before = this.props.game.gameComplete ? false : true;
        circleStyle = {color: "#005780", backgroundColor: "tranparent",
                        position: "relative", top: "40px", textAlign: "center"};
    console.log("BeforeAfter: " + this.props.game.gameComplete);
    return (
      <div> 
      {
        before ?
          <div className="float-center" style={circleStyle}>Game will start in
            <CountDownCircle fromSeconds={5} countDown={this.props.game.countDown} color="#005780"/>
          </div>
        :
          <div className="float-center" style={{position: "relative", top: "70px", width: "70%"}}>
            <GameResultTable remoteCall={'getFinalResult'} gameName={this.props.game.name}/>
          </div>
      }
      </div>
    );
  } 
}

export default BeforeAfterGame;
