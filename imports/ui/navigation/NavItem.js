import React from 'react';
import './Nav.css';

const navItem = (props) => (
  <a href={props.link} onClick={() => props.action(props.link)} className={props.clName}>
     {props.title}
  </a>
);

export default navItem;

