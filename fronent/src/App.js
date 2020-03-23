import React, { Component } from 'react';
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
      this.state.messages.map((message, index) => {
        return <div key={index}> {message} </div>
      })
    );
  }
}

export default App;
