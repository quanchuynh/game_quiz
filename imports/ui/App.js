import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Image from './components/Image';
import NavBar from './navigation/NavBar';
import Practice from './pages/Practice';
import Home from './pages/Home';
import Game from './pages/Game';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

class App extends Component {
  constructor(props) {
    super(props);
    this.createGamePath = createGamePath;
    this.joinGamePath = joinGamePath;
    this.addPlayerPath = addPlayerPath
    this.watchGamePath = watchGamePath;
    this.handleSelect = this.handleSelect.bind(this);
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
           <Route path='/SignIn' component={SignIn}/>
           <Route path='/SignUp' component={SignUp}/>
           <Route path='/'         component={Home}/>
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
