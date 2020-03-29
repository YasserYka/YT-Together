import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Index from './components/layout/Index';


import './App.css';

class App extends Component {

  render() {
    return (
        <div className="container">
          <Index />
        </div>
    );
  }
}

export default App;
