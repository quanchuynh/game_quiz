import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Image from './components/Image';
import NavBar from './navigation/NavBar';
import Practice from './pages/Practice';
import Home from './pages/Home';
import CreateGame from './pages/CreateGame';
import Register from './pages/Register';

class App extends Component {
  render() {
    /* Use global for consistency of route paths */
    let createGamePath = createGamePath,
        addPlayerPath = addPlayerPath,
        joinGamePath = joinGamePath,
        watchGamePath = watchGamePath;
        
    return (
      <div className="App">
      <NavBar/>
      <BrowserRouter>
        <Switch>
           <Route path='/practice' component={Practice}/>
           <Route path={createGamePath} component={CreateGame}/>
           <Route path={addPlayerPath} component={CreateGame}/>
           <Route path={joinGamePath} component={CreateGame}/>
           <Route path={watchGamePath} component={CreateGame}/>
           <Route path='/register' component={Register}/>
           <Route path='/'         component={Home}/>
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
