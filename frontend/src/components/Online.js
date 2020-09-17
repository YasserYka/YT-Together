import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Online extends Component {

    constructor(props){
        super(props);
        this.state = { 
            users: []
        }

        this.giveControl = this.giveControl.bind(this);
    }

    componentDidMount(){
        this.props.socket.addEventListener('message', event => {
            let data = JSON.parse(event.data);
            if(data.event === 'online')
                this.handleMessage(data);
        });
    }

    handleMessage = data => {
        if(data.action === 'join')
            this.setState({users: [...this.state.users, data.users]});
        else if(data.action === 'leave')
            this.handleLeaveAction(data);
        else if(data.action === 'onlineuserslist')
            this.setState({users: this.state.users.concat(data.users)});
        else if(data.action === 'newcontroller')
            this.newControllerAction(data);
    }

    leaveRoom = () => {
        this.props.socket.send(JSON.stringify({
          event: 'room',
          action: 'leave',
          roomId: this.props.roomId,
          username: this.props.username
        }));
    }

    handleLeaveAction = data => {
        this.setState({users: this.state.users.filter(user => user.username !== data.username)});
    }

    newControllerAction = data => {
        let newUsers = this.state.users;

        newUsers.forEach(user => {
            if(data.username === user.username)
                user.controller = true;
            else if(user.controller === true)
                user.controller = false;
        });

        this.setState({
            users: newUsers
        });
    }

    giveControl = event => {
        if(event)
            event.preventDefault();

            if(this.props.controller){
            this.props.socket.send(JSON.stringify({
                event: 'control',
                action: 'assign',
                roomId: this.props.roomId,
                toUsername: event.target.dataset.username,
                username: this.props.username
            }));
        }
    }

    render () {

        const { users } = this.state;
        return (
            <div className="w-50 p-3 ">
                <div className="card-header text-center"> Online <i class="fa fa-users" aria-hidden="true"></i> </div>
                <ul className="list-group">
                    {
                        users.map((user, key) => (
                            <div key={key}>
                                <li onClick={this.giveControl} data-username={user.username} className="list-group-item">{user.username} <span className="badge badge-success ml-3">{user.controller ? "Controller" : "Active"}</span></li> 
                            </div>
                        ))
                    }
                </ul>
                <div class="mt-5 col text-center">
                    <Link to="/" onClick={this.leaveRoom}>
                        <button className="btn btn-lg">
                            Leave Room
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

}

export default Online;