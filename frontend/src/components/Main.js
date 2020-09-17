import React, { Component } from 'react';

import Chat from './Chat';
import Watch from './Watch';
import Online from './Online';

class Main extends Component {

  constructor(props){
    super(props);

    this.state = {
      roomId: this.props.location.state.roomId,
      username: this.props.location.state.username,
      controller: false
    }

    this.socket = new WebSocket("ws://localhost:8080");
  }

  componentDidMount(){
    this.socket.onopen = () => {

      this.socket.send(JSON.stringify({
              event: 'room',
              action: this.props.location.state.action,
              username: this.state.username,
              roomId: this.state.roomId
        })
      );
      
      this.socket.addEventListener('message', event => {
          let data = JSON.parse(event.data);

          if(data.event === 'control')
            if(data.action == 'controller')
              this.setState({controller: true});
            else if(data.action == 'guest')
              this.setState({controller: false});
          });

    }

    this.socket.onclose = () => {
      console.warn('Websocket Disconnected');
    }
  }


  render() {
      return (
        <React.Fragment>
          <div className="d-flex justify-content-start m-5">
              <Chat username={this.state.username} roomId={this.state.roomId} socket={this.socket} />
              <Watch controller={this.state.controller} roomId={this.state.roomId} socket={this.socket} />
              <Online username={this.state.username} controller={this.state.controller} roomId={this.state.roomId} socket={this.socket} />
          </div>
        </React.Fragment>
      )
  }
} 

export default Main;
