import React, { Component } from 'react';

class Chat extends Component {

    constructor(props){
        super(props);

        this.state = { 
            roomId: this.props.roomId,
            inputMessage: '',
            messages: [],
        }

        this.handleMessage = this.handleMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount(){
        this.props.socket.addEventListener('message', event => {
            let data = JSON.parse(event.data);
            if(data.event === 'chat')
                this.handleMessage(data);
        });

    }

    handleMessage = data => {
        this.AppendMessage(data.from, data.body);
    }

    handleOnChange = event => {
        if(event)
            event.preventDefault();

        this.setState({
            inputMessage: event.target.value
        });
    }

    AppendMessage = (from, body) => {
        this.setState({
            messages: [{from: from, body: body}, ...this.state.messages]
        });

    }

    sendMessage = message => {
       this.props.socket.send(JSON.stringify(message)); 
    }

    handleOnSubmit = event => {
        if(event)
            event.preventDefault();

        let inputMessage = this.state.inputMessage;
        
        this.AppendMessage('You', inputMessage);

        this.sendMessage({
                event: "chat",
                action: "brodcast",
                roomId: this.state.roomId,
                body: inputMessage,
                from: this.props.username
            }
        );

        this.setState({
            inputMessage: ''
        })
    }

    render () {

        const { messages } = this.state;

        return (
          <div className="w-50 h-100 p-3">
            <div className="card-header">Messages </div>

            <ul className="list-group">
                {
                    messages.map((message, key) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={key}>{message.from}: {message.body}</li>
                    ))
                }
            </ul>
            
            <form className="form-inline mt-4 w-100" onSubmit={this.handleOnSubmit} >
                <div className="form-group mx-sm-3 mb-2">
                    <input className="form-control" placeholder="Enter a message" onChange={this.handleOnChange} value={this.state.inputMessage} required />
                </div>
                <button className="btn btn-primary mb-2 mx-auto d-block" type="submit">Send</button>
            </form>
          </div>
        )
    }
}

export default Chat;