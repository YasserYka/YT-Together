import React, { Component } from 'react';
import Watch from '../Watch';

class Index extends Component {

    state = {
        url: "ws://localhost:8080",
    }
    
    socket = new WebSocket(this.state.url);
    
    sendMessage = message => this.socket.send(JSON.stringify({message: message}));
    
    componentDidMount(){
        this.socket.onopen = () => {
          console.info('Websocket Connected');
        }
    
        this.socket.onclose = () => {
          console.warn('Websocket Disconnected');
        }
    }

    render() {
        return (
            <React.Fragment>
                <Watch socket={this.socket} />
            </React.Fragment>
        )
    }
}

export default Index;