import React, { Component } from 'react';
import CountDownCircle from '../components/CountDownCircle';
import GameResultTable from '../components/GameResultTable';
import PlayerActivityTable from '../components/PlayerActivityTable';

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
                        position: "relative", top: "80px", textAlign: "center"};
    console.log("BeforeAfter: " + this.props.game.gameComplete);
    return (
      <div> 
      {
        before ?
          <div className="float-center" style={circleStyle}><h2>Game will start in</h2>
            <CountDownCircle fromSeconds={5} countDown={this.props.game.countDown} color="#005780"/>
          </div>
        :
          <div className="float-center" style={{position: "relative", top: "70px", width: "70%"}}>
            <GameResultTable remoteCall={'getFinalResult'} gameName={this.props.game.name}/>
            <PlayerActivityTable remoteCall={'getPlayerActivities'} gameName={this.props.game.name}
                tableTitle={'Activities This Quarter'}/>
          </div>
      }
      </div>
    );
  } 
}

export default BeforeAfterGame;
