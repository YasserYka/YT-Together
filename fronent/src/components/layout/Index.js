import React, { Component } from 'react';
import Watch from '../Watch';
import Main from '../Main';

class Index extends Component {

   state = {
            showForm: false,
            clickedForm: 'create',
            username: 'null',
            roomId: 'null',
            redirect: false
    }

    clickedForm = event => {
        this.setState({showForm: true, clickedForm: event.target.value});
    };

    sendForm = event => {
        if(event)
        event.preventDefault();

        this.setState({username: this.refs.username.value, roomId: this.refs.roomId.value, redirect: true});
    }


    render() {

        if(this.state.redirect)
            <Redirect to={{
                            pathname: '/Main',
                            state: {
                                username: this.state.username,
                                roomId: this.state.roomId,
                                action: this.state.clickedForm
                            }
                        }}
            />

        return (
            <div className="col-sm-12 my-auto">
                {
                    this.state.errorOccurred ? <div> this.state.errorMessage </div> : null
                }
                {this.state.showForm ? 
                        <form onSubmit={this.sendForm}>
                        <div className="form-group">
                            <input className="form-control" type="text" ref="username" placeholder="You Username" required />
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="text" ref="roomId" placeholder="Room Id" required />
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="submit" value="Submit" />
                        </div>
                        </form> 
                     
                     : null
                }
                <div className="modal-body">
                    <button onClick={this.showFormComponent} value="create" className="btn btn-info btn-lg btn-block active">Create Room</button>
                    <button onClick={this.showFormComponent} value="join" className="btn btn-secondary btn-lg btn-block active">Join Room</button>
                </div>
            </div>
        )
    }
}

export default Index;