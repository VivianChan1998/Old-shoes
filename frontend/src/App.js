import React from 'react';
import './App.css';
import {Switch, Route} from 'react-router-dom'
import Home from './Container/Home'
import Upload from './Container/Upload'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/upload'>
          <Upload />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
