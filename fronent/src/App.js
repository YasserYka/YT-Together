import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Index from './components/layout/Index';
import Main from './components/Main';


import './App.css';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Switch>
                  <Route exact path="/" component={Index} />
                  <Route exact path="/main" component={Main} />
          </Switch>        
        </div>
      </Router>
    );
  }
}

export default App;
