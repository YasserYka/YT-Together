import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Chat from './Chat';
import Watch from './Watch';
import Online from './Online';

class Main extends Component {

  constructor(props){
    super(props);

    this.state = {
      url: "ws://localhost:8080",
      roomId: this.props.location.state.roomId,
      username: this.props.location.state.username,
      haveControll: false
    }

    this.socket = new WebSocket(this.state.url);
  }



    setHaveControll = bool => {
      this.setState({haveControll: bool});
    }
    
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
        
        this.socket.addEventListener('message', event => {
            let data = JSON.parse(event.data);
            console.log(data)
            if(data.event === 'control')
              this.handleControlEvent(data)
          }
        );

      }

      this.socket.onclose = () => {
        console.warn('Websocket Disconnected');
      }
    }

    handleControlEvent = data => { 
      if(data.action === 'youhavecontrol')  
        this.setHaveControll(data.youHaveControl)

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
                <Watch haveControll={this.state.haveControll} socket={this.socket} />
                <Chat username={this.state.username} roomId={this.state.roomId} socket={this.socket} />
                <Online username={this.state.username} haveControll={this.state.haveControll} roomId={this.state.roomId} socket={this.socket} />
            </div>

            <Link to="/" onClick={this.leaveRoom}>
              <button className="btn btn-primary btn-lg mx-auto d-block">
                Leave Room
              </button>
            </Link>
          </React.Fragment>
        )
    }
} 

export default Main;
