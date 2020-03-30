import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Index extends Component {

   state = {
            showForm: false,
            clickedForm: 'create',
            username: 'null',
            roomId: 'null',
            redirect: false
    }

    clickedFormHandler = event => {
        this.setState({showForm: true, clickedForm: event.target.value});
    };

    submitHandler = event => {
        if(event)
        event.preventDefault();

        this.setState({username: this.refs.username.value, roomId: this.refs.roomId.value, redirect: true});
    }


    render() {

        if(this.state.redirect){
            return <Redirect to={{
                            pathname: '/main',
                            state: {
                                username: this.state.username,
                                roomId: this.state.roomId,
                                action: this.state.clickedForm
                            }
                        }}
            />
        }

        return (
            <div className="col-sm-12 my-auto">
                {
                    this.state.errorOccurred ? <div> this.state.errorMessage </div> : null
                }
                {this.state.showForm ? 
                        <form onSubmit={this.submitHandler}>
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
                    <button onClick={this.clickedFormHandler} value="create" className="btn btn-info btn-lg btn-block active">Create Room</button>
                    <button onClick={this.clickedFormHandler} value="join" className="btn btn-secondary btn-lg btn-block active">Join Room</button>
                </div>
            </div>
        )
    }
}

export default Index;