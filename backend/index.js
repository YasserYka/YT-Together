const WebSocket = require('ws').Server, server  = require('http').createServer();
const wss = new WebSocket({ server: server }), port = process.env.PORT || 8080, app = require('./http-server');
server.on('request', app);

let assignControll = true;

let rooms = []

wss.on('connection', ws => {
    if(assignControll){
        ws.send(JSON.stringify({event: 'control', youHaveControll: true}));
        assignControll = false;
    }
    ws.on('message', message => brodcastMessage(ws, message));
});

  wss.on('close', () => {
    console.log('Closed');
});

server.listen(port, () => {
    console.log(`Listening on ${port}!`);
});

const brodcastMessage = (ws, message) => {
    wss.clients.forEach(client => {
        if(ws !== client)
            client.send(message);     
    });
}
