import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Watch from "./components/Watch";
import Index from "./components/layout/Index";

import './App.css';

class App extends Component {

  state = {
    url: "ws://localhost:8080",
    messages: []
  }

  socket = new WebSocket(this.state.url);

  addMessage = message => {
    this.setState({
      messages: this.state.messages.concat(message)
    });
  }

  sendMessage = message => this.socket.send(JSON.stringify({message: message}));

  componentDidMount(){

    this.socket.onopen = () => {
      console.info('Websocket Connected');
    }

    this.socket.onmessage = event => {
      this.addMessage(JSON.parse(event.data).message);
    }

    this.socket.onclose = () => {
      console.warn('Websocket Disconnected');
    }
  }

  render() {
    return (
      <Router>
        <React.Fragment>
          <div className="container">
            <Switch>
              <Route exact path="/" component={Index} />
              <Route exact path="/Watch" component={Watch} />
            </Switch>
          </div>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
