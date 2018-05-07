import React from           'react';
import NavItem from         './NavItem';
import DropdownNavItem from './DropdownNavItem';
import './Nav.css';

const NavBar = (props) => {
  let dropdown = [{title: 'Create New Game', link: 'create-game'},
                    {title: 'Join Game', link: 'join-game'},
                    {title: 'Add Player(s)', link: 'add-player'}];
  return (
    <div className="navbar">
        <NavItem link="/" title="Home" exact></NavItem>
        <NavItem link="/Practice" title="Practice" exact></NavItem>
        <DropdownNavItem label="Game" opts={dropdown} exact></DropdownNavItem>
        <NavItem link="/Register" title="Register"></NavItem>
    </div>
  );

};

export default NavBar;

