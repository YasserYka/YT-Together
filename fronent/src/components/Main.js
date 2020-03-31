import React, { Component } from 'react';

import Chat from './Chat';
import Watch from './Watch';
import Online from './Online';

class Main extends Component {

    state = {
        url: "ws://localhost:8080",
        roomId: this.props.location.state.roomId,
        username: this.props.location.state.username
    }

    socket = new WebSocket(this.state.url);
    
    componentDidMount(){
      this.socket.onopen = () => {
        console.log('Websocket Connected');

        this.socket.send(JSON.stringify({
                event: "room",
                action: this.props.location.state.action,
                username: this.props.username,
                roomId: this.state.roomId
            })
          );
      }

      this.socket.onclose = () => {
        console.warn('Websocket Disconnected');
      }
    }

    render() {
        return (
          <div className="d-flex justify-content-start mt-5">
              <Watch socket={this.socket} />
              <Chat username={this.state.username} roomId={this.state.roomId} socket={this.socket} />
              <Online roomId={this.state.roomId} socket={this.socket} />
          </div>
        )
    }
} 

export default Main;
