import React, { Component } from 'react';

class Chat extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.socket.addEventListener('message', event => {});
    }

}

export default Chat;