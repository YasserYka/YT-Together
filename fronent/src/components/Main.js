import React, { Component } from 'react';

import Chat from './Chat';
import Watch from './Watch';

class Main extends Component {

    state = {
        url: "ws://localhost:8080",
    }

    socket = new WebSocket(this.state.url);
    
    componentDidMount(){

        this.socket.onopen = () => {
          console.log('Websocket Connected');
            this.socket.send(JSON.stringify({
                event: "room",
                action: this.props.location.state.action,
                username: this.props.location.state.username,
                roomId: this.props.location.state.roomId
              })
            );
        }
    
        this.socket.onclose = () => {
          console.log('Websocket Disconnected');
        }
      }

    render() {

        return (
            <React.Fragment>
                <Watch socket={this.socket} />
                <Chat socket={this.socket} />
            </React.Fragment>
        )
    }
} 

export default Main;