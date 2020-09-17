import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class Index extends Component {

   state = { action: 'create', username: 'null', roomId: 'null', redirect: false }


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
            <div class="wrapper fadeInDown">
                <div id="formContent">

                    <div class="fadeIn first">
                        <img src="/icon.png" id="icon" alt="User Icon" />
                    </div>

                    <form onSubmit={this.submitHandler}>
                        <input type="text" ref="username" placeholder="You Username" class="fadeIn second" required />
                        <input type="text" ref="roomId" placeholder="Room Id" class="fadeIn third" required />
                        <div className="custom-control custom-radio custom-control-inline">
                            <input value="join" type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" onChange={this.radioButtonHandler} />
                            <label className="custom-control-label" htmlFor="customRadioInline2">Join Room</label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                            <input value="create" type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" onChange={this.radioButtonHandler} />
                            <label className="custom-control-label" htmlFor="customRadioInline1">Create Room</label>
                        </div>
                        <input type="submit" value="Submit" class="fadeIn fourth" />
                    </form>
                </div>
            </div>
        )
    }
}

export default Index;