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
    return (
      <div className="App">
      <NavBar/>
      <BrowserRouter>
        <Switch>
           <Route path='/practice' component={Practice}/>
           <Route path='/create-game' component={CreateGame}/>
           <Route path='/add-player' component={CreateGame}/>
           <Route path='/join-game' component={CreateGame}/>
           <Route path='/watch-game' component={CreateGame}/>
           <Route path='/register' component={Register}/>
           <Route path='/'         component={Home}/>
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
