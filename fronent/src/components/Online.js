import React, { Component } from 'react';

class Online extends Component {

    constructor(props){
        super(props);

        this.state = { 
            roomId: this.props.roomId,
            users: [],
        }

    }

    componentDidMount(){
        this.props.socket.addEventListener('message', event => {
            let data = JSON.parse(event.data);
            if(data.event === 'online')
                this.handleMessage(data);
        });
    }

    setHaveControll = bool => {
        this.haveControll = bool;
      }

    handleMessage = data => {
        if(data.action === 'joined')
            this.setState({users: [...this.state.users, data.users]});
        else if(data.action === 'left'){
            this.setState(prevState => ({
                    users: prevState.users.filter(user => user !== data.username)
                })
            )
        }
        else if(data.action === 'alreadyjoined')
            this.setState({users: this.state.users.concat(data.users)});
    }

    render () {

        const { users } = this.state;
        return (
            <div className="align-self-center w-50 p-3">
                <div className="card-header">Online Users</div>
                <ul className="list-group">
                    {
                        users.map((user, key) => (
                            <div key={key}>
                                <li data-username={user.username} className="list-group-item">{user.username} <span className="badge badge-success ml-3">{user.haveControll ? "Controller" : "Active"}</span></li> 
                            </div>
                        ))
                    }
                </ul>
            </div>
        )
    }

}

export default Online;