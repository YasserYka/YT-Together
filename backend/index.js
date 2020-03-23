const WebSocket = require('ws').Server, server  = require('http').createServer();
const wss = new WebSocket({ server: server }), port = process.env.PORT || 8080, app = require('./http-server');
server.on('request', app);

wss.on('connection', ws => {
    ws.send(JSON.stringify({message: 'Get ready!'}));
    ws.on('message', message => console.log('received: %s', message));
});

  wss.on('close', () => {
    console.log('Closed');
});

server.listen(port, () => {
    console.log(`Listening on ${port}!`);
});