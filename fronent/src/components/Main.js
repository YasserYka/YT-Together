import React, { Component } from 'react';
import { Link } from "react-router-dom";

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
                event: 'room',
                action: this.props.location.state.action,
                username: this.state.username,
                roomId: this.state.roomId
            })
          );
      }

      this.socket.onclose = () => {
        console.warn('Websocket Disconnected');
      }
    }

    leaveRoom = () => {
      this.socket.send(JSON.stringify({
        event: 'room',
        action: 'leave',
        roomId: this.state.roomId,
        username: this.state.username
      }));
    }

    render() {
        return (
          <React.Fragment>
            <div className="d-flex justify-content-start m-5">
                <Watch socket={this.socket} />
                <Chat username={this.state.username} roomId={this.state.roomId} socket={this.socket} />
                <Online roomId={this.state.roomId} socket={this.socket} />
            </div>

            <Link to="/" onClick={this.leaveRoom}>
              <button className="btn btn-primary btn-lg mx-auto d-block">
                Go Home
              </button>
            </Link>
          </React.Fragment>
        )
    }
} 

export default Main;
