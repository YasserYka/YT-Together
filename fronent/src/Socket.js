
const Socket = (() => {

    let socket;

    function initialize() {
        socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.info('Websocket Connected');
        }
      
        socket.onclose = () => {
            console.warn('Websocket Disconnected');
        }
    }

    return {
        initialize: () => {
            if(socket == null){
                socket = new initialize();
                socket.constructor = null;
            }
        },
        send: message => {
            socket.send(message);
        },
        
    }

})();

export default Socket;
