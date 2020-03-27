import React, { Component, useRef } from 'react';
import Watch from '../Watch';

class Index extends Component {

    constructor(){
        super();

        this.state = {
            showForm: false
        }
        this.showFormComponent = this.showFormComponent.bind(this);
    }

    /*state = {
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

    submitCreateRoom = event => {
        if(event)
            event.preventDefault();

        this.socket.send(JSON.stringify({
            event: "room",
            action: "create",
            roomId: this.refs.roomId.value,
            username: this.refs.username.value
        }));
    }*/

    showFormComponent = () => this.setState({showForm: true});



    render() {
        return (
            <React.Fragment>
                {this.state.showForm ? 
                        <form>
                        <input type="text" ref="username" placeholder="You Username" required />
                        <input type="text" ref="roomId" placeholder="Room Id" required />
                        <input type="submit" value="Submit" />
                        </form> 
                        : null
                }
                <div className="modal-body">
                    <button onClick={this.showFormComponent} value="create" className="btn btn-info btn-lg btn-block">Create Room</button>
                    <button onClick={this.showFormComponent} value="join" className="btn btn-secondary btn-lg btn-block">Join Room</button>
                </div>
            </React.Fragment>
            /*
            <React.Fragment>
                <form onSubmit={this.submitCreateRoom}>
                    <input type="text" ref="username" placeholder="You Username" required />
                    <input type="text" ref="roomId" placeholder="Room Id" required />
                    <input type="submit" value="Submit" />
                </form>
                <Watch socket={this.socket} />
            </React.Fragment>*/
        )
    }
}

export default Index;