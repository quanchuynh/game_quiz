import React, { Component } from 'react';

class BeforeAfterGame extends Component {
  /* Render info before game start and after game completed. */
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      finalResult: {__html:  ''} 
    };
    this.finalResult = {__html:  '<div>Init final result</div>'};
    this.getFinalResult = this.getFinalResult.bind(this); 
    this.formatQuizResult = this.formatQuizResult.bind(this); 
  }

  componentDidMount( ) {
    if (this.props.game.gameComplete) {
      this.getFinalResult( );
    }
  }

  getFinalResult( ) {
    Meteor.call('getFinalResult', this.props.game.name, (err, ret) => {
      console.log("BeforeAfter, getFinalResult: " + JSON.stringify(ret));
      var content = '<span style="float: left"> Game: ' + ret.gameName  + '</span><br/>' +
                    ret.results.map((res) => this.formatQuizResult(res));
      console.log("BeforeAfter, set final reulst " + content);
      let finalResult = {__html:  content};
      this.setState({finalResult: finalResult});
    });
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
    console.log("BeforeAfter: " + this.props.game.gameComplete);
    return (
      <div> 
      {
        before ?
          <div> Game will start in {this.props.game.countDown} seconds</div>
        :
          <div className="finalResult">
            <h5 className="small-8" style={{color: "#005780"}} dangerouslySetInnerHTML={this.state.finalResult}/>
          </div>
      }
      </div>
    );
  } 
}

export default BeforeAfterGame;
