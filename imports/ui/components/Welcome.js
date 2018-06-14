import React from 'react';

let emphasize = {color: "blue"};
let greeting = {color: "#005780"};

const Welcome = (props) => (
  <h4 style={greeting}>Welcome, <span style={emphasize}>{props.name}</span></h4>
);

export default Welcome;

