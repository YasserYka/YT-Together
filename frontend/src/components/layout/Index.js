import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Index extends Component {

   state = {
    action: 'create',
            username: 'null',
            roomId: 'null',
            redirect: false
    }


    submitHandler = event => {
        if(event)
            event.preventDefault();

        this.setState({username: this.refs.username.value, roomId: this.refs.roomId.value, redirect: true});
    }

    radioButtonHandler = event => {
        if(event)
            event.preventDefault();

        this.setState({action: event.target.value});
    }


    render() {

        if(this.state.redirect){
            return <Redirect to={{
                            pathname: '/main',
                            state: {
                                username: this.state.username,
                                roomId: this.state.roomId,
                                action: this.state.action
                            }
                        }}
            />
        }

        return (
            <div className="col-sm-12 my-auto">
                <div className="container mt-5">
                    <form onSubmit={this.submitHandler}>
                        <div className="form-group">
                            <input className="form-control" type="text" ref="username" placeholder="You Username" required />
                        </div>
                        <div className="form-group">
                            <input  className="form-control" type="text" ref="roomId" placeholder="Room Id" required />
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input value="create" type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" onChange={this.radioButtonHandler} />
                            <label className="custom-control-label" htmlFor="customRadioInline1">Create Room</label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input value="join" type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" onChange={this.radioButtonHandler} />
                            <label className="custom-control-label" htmlFor="customRadioInline2">Join Room</label>
                        </div>
                        <div className="form-group">
                            <input className="form-control btn btn-info btn-lg btn-block mt-3" type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Index;