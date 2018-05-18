import React from 'react';
import './Nav.css';

const dropdownNavItem = (props) => {
  let options = props.opts;
  let label = props.label + ' '; 
  let clName = "dropbtn " + props.clName;

  return (
    <div className="DropdownNavItem">
      <button className={clName}>{label}
        <i className="fa fa-caret-down"></i>
      </button>
      <div className="DropdownNavItem-content">
      {
        options.map((item, i) => (<a key={i} href={item.link}> {item.title} </a>))
      }
      </div>
    </div>
  );
};

export default dropdownNavItem;

