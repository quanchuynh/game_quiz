import React, { Component } from 'react';
import CountDownCircle from '../components/CountDownCircle';
import GameResultTable from '../components/GameResultTable';
import PlayerActivityTable from '../components/PlayerActivityTable';
import QuizResultDetail from '../components/QuizResultDetail';

class BeforeAfterGame extends Component {
  /* Render info before game start and after game completed. */
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      finalResult: {__html:  ''},
      rawFinalResult: {},
      quizList: []  /* didMount fillup later, valid for init render */,
      gotList: false
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

  componentDidMount() {
    Meteor.call('getGameQuizList', this.props.game.name, (err, ret) => {
      this.setState({quizList: ret.quizList, gotList: true});
      console.log("gameQuizLis: " + JSON.stringify(ret));
    });
  }

  render() {
    let before = this.props.game.gameComplete ? false : true;
        circleStyle = {color: "#005780", backgroundColor: "tranparent",
                        position: "relative", top: "80px", textAlign: "center"},
        game = this.props.game,
        quizList = this.state.quizList;
    console.log("BeforeAfter, quizList: " + JSON.stringify(quizList));
    return (
      <div> 
      {
        before ?
          <div className="float-center" style={circleStyle}><h2>Game will start in</h2>
            <CountDownCircle fromSeconds={5} countDown={this.props.game.countDown} color="#005780"/>
          </div>
        :
          <div className="float-center" style={{position: "relative", top: "70px", width: "70%"}}>
            <GameResultTable remoteCall={'getFinalResult'} gameName={game.name}/>
            <PlayerActivityTable remoteCall={'getPlayerActivities'} gameName={game.name}
                tableTitle={'Activities This Quarter'}/>
            { 
              this.state.gotList ?
                quizList.map( (quizId, ii)  => ( <QuizResultDetail quizId={quizId} gameName = {game.name} key={ii}/> ) )
              :
                <span/>
            }
          </div>
      }
      </div>
    );
  } 
}

export default BeforeAfterGame;
