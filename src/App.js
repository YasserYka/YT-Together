import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(){
    this.state = {
      url: "ws://localhost:8080",
      messages: []
    }
  }

  socket = new WebSocket(this.state.url);

  componentDidMount(){

    this.socket.onopen = () => {
      console.info('Websocket Connected');
    }

    this.socket.onmessage = event => {
      console.info('Message received: ', JSON.parse(event.data));
    }

    this.socket.onclose = () => {
      console.warn('Websocket Disconnected');
    }
  }

  render() {
    return (
     ths.state.messages.map(message => {
       return <p> {message} </p>
     })
    );
  }
}

export default App;
