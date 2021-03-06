import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Image from './components/Image';
import NavBar from './navigation/NavBar';
import Practice from './pages/Practice';
import Home from './pages/Home';
import Game from './pages/Game';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ChangePassword from './pages/ChangePassword';
import LogOut from './pages/LogOut';

class App extends Component {
  constructor(props) {
    super(props);
    this.createGamePath = createGamePath;
    this.joinGamePath = joinGamePath;
    this.addPlayerPath = addPlayerPath
    this.watchGamePath = watchGamePath;
    this.changePasswordPath = changePasswordPath;
    this.logOutPath = logOutPath;
    this.handleSelect = this.handleSelect.bind(this);
    this.SignInPath = SignInPath;
    this.SignUpPath = SignUpPath;
  }

  handleSelect(link) {
  }

  render() {
    return (
      <div className="App">
      <NavBar action={this.handleSelect}/>
      <BrowserRouter>
        <Switch>
           <Route path='/practice' component={Practice}/>
           <Route path={this.createGamePath} component={Game}/>
           <Route path={this.addPlayerPath} component={Game}/>
           <Route path={this.joinGamePath} component={Game}/>
           <Route path={this.watchGamePath} component={Game}/>
           <Route path={this.SignInPath} component={SignIn}/>
           <Route path={this.SignUpPath} component={SignUp}/>
           <Route path={this.changePasswordPath} component={ChangePassword}/>
           <Route path={this.logOutPath} component={LogOut}/>
           <Route path='/'         component={Home}/>
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
