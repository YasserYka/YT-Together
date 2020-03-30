import React, { Component } from 'react';

class Chat extends Component {

    constructor(props){
        super(props);

        this.state = { 
            roomId: this.props.roomId,
            inputMessage: '',
            messages: []
        }

        this.handleMessage = this.handleMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentDidMount(){
        this.props.socket.addEventListener('message', event => {
            let data = JSON.parse(event.data);
            console.log(data);
            if(data.event === 'chat')
                this.handleMessage(data);
        });

    }

    handleMessage = data => {
        this.setState({
            messages: [...this.state.messages, {from: data.from, body: data.body}]
        });
    }

    handleOnChange = event => {
        if(event)
            event.preventDefault();

        this.setState({
            inputMessage: event.target.value
        });
    }

    sendMessage = message => {
       this.props.socket.send(JSON.stringify(message)); 
    }

    handleOnSubmit = event => {
        if(event)
            event.preventDefault();

        this.sendMessage({
                event: "chat",
                action: "brodcast",
                roomId: this.state.roomId,
                body: this.state.inputMessage,
                from: this.props.username
            }
        );
    }

    render () {

        const { messages } = this.state;

        return (
          <React.Fragment>
            {
                messages.map((message, key) => (
                        <div key={key}>
                            <span>FROM {message.from} :</span>
                            <span>{message.body}</span>
                        </div>
                    )
                )
            }
            <form onSubmit={this.handleOnSubmit}>
                <input placeholder="Enter a message" onChange={this.handleOnChange} value={this.state.inputMessage} />
                <button type="submit">Send</button>
            </form>
          </React.Fragment>
        )
    }
}

export default Chat;