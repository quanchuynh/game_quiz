import React, { Component } from           'react';
import NavItem from         './NavItem';
import DropdownNavItem from './DropdownNavItem';
import { Meteor } from 'meteor/meteor';
import './Nav.css';
import { withTracker } from 'meteor/react-meteor-data';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: '/'
    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(link) {
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.link !== nextProps.link)
      return {activeLink: nextProps.link };
    return null;
  }
 
  render() {
    let dropdown = [
                      {title: 'Create New Game', link: 'create-game'},
                      {title: 'Join Game', link: 'join-game'},
                      /* {title: 'Add Player(s)', link: 'add-player'}, */
                      {title: 'Watch a Game',  link: 'watch-game'}
                   ];
    let home = getSelectedNav() == HomePath ? "active" : "inactive";  
    let practice = getSelectedNav() == PracticePath ? "active" : "inactive";  
    let game = getSelectedNav() == GamePath ? "active" : "inactive";  
    let signIn = getSelectedNav() == SignInPath ? "active" : "inactive";  
    let signUp = getSelectedNav() == SignUpPath ? "active" : "inactive";  
    let signInTitle = this.props.currentUser ? this.props.currentUser : SignInTitle;

    return (
      <div className="navbar">
           <NavItem clName={home} link={HomePath} title="Home" exact action={this.handleSelect}></NavItem>
           <NavItem clName={practice} link={PracticePath} title="Practice" exact action={this.handleSelect}></NavItem>
           <DropdownNavItem clName={game} label="Game" opts={dropdown} exact action={this.handleSelect}></DropdownNavItem>
           <NavItem clName={signIn} link={SignInPath} title={signInTitle} action={this.handleSelect}></NavItem>
           <NavItem clName={signUp} link={SignUpPath} title="Sign Up" action={this.handleSelect}></NavItem>
      </div>
    );
  }
};

export default withTracker( ( ) => {
  /* Make current user reactive to switch SignIn label. */
  let user = Meteor.user();
  let currentUser = null;
  if (user) {
    currentUser = user.username;
  }
  return {
    currentUser: currentUser
  }
})(NavBar);
