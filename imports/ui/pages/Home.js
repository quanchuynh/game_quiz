import React, { Component } from 'react';
import './Home.css';
import RotatingBackgroundImage from '../components/RotatingBackgroundImage';
import PlayerActivityTable from '../components/PlayerActivityTable';
import CountDownCircle from '../components/CountDownCircle';

class Home extends Component {
  render() {
    let textStyle = {position: "absolute", top: "30px", textAlign: "center", 
                     marginLeft: "10%", marginRight: "auto"};
    return (
      <div className="homePage">
        <RotatingBackgroundImage/>
        <div style={textStyle}>
          <h1>Welcome to the Encyclopedic Brain</h1>
          <h4> Have Fun, Play</h4>
          <h4> Expand Your Knowledge, Play</h4>
          <h4> Gain Intellectual Satisfaction, Play</h4>
          <h4> Earn Money, Play</h4>
        </div>
        <PlayerActivityTable remoteCall={'getTopPlayers'} gameName={'ignore'}
          tableTitle={'This Quarter Top Encyclopedic Brains'}/>
      </div>

    );
  }
}

export default Home;
