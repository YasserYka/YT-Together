const WebSocket = require('ws').Server, server  = require('http').createServer();
const wss = new WebSocket({ server: server }), port = process.env.PORT || 8080, app = require('./http-server');
server.on('request', app);

wss.on('connection', ws => {

    console.log('Connected!');
    /*ws.on('message', function incoming(message) {
      src = message;
      console.log('received: %s', message);
    });*/
    ws.send('Get ready!');
  });

  wss.on('close', () => {
    console.log('Closed');
});

server.listen(port, () => {
    console.log(`listening on ${port}!`);
});