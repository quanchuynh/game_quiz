import React from 'react';

let emphasize = {color: "blue"};

const Welcome = (props) => (
  <h4>Welcome <span style={emphasize}>{props.name}</span></h4>
);

export default Welcome;

