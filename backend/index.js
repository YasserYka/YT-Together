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
    ws.on('message', message => {
        console.log(JSON.parse(message));
        handleMessage(message, ws);
    });
});

wss.on('close', () => {
    console.log('Closed');
});

server.listen(port, () => {
    console.log(`Listening on ${port}!`);
});

const brodcastMessage = (data, users) => {
    users.forEach(user => {
        user.ws.send(data);
    });
}

const handleMessage = (data, ws) => {
    let event = data.event;
    if(event === 'room')
        handleRoomEvent(data, ws);
    else if(event == 'sync'){
        console.log(data)
        handleSyncEvent(data, ws);
    }
}

const handleSyncEvent = (data, ws) => {
    rooms.forEach(room => {
        room.users.forEach(user => {
            if(user.ws == ws)
                brodcastMessage(data, room.users);
        });
    });
}

const joinRoom = (data, ws) => {
    let roomFound, statusResponse;
    rooms.forEach(room => {
        if(room.roomId === data.roomId){
            roomFound = true;
            room.users.push({username: data.username, ws: ws});
        }
    });

    if(roomFound)
        statusResponse = "ok";
    else
        statusResponse = "not_found";

    ws.send(JSON.stringify({event: "room", action: "join", response: statusResponse}));
}

const handleRoomEvent = (data, ws) => {
    let action = data.action;
    if(action === 'create')
        rooms.push({roomId: data.roomId, users: [{username: data.username, ws: ws}]});
    else if(action === 'join')
        joinRoom(data, ws);
    printRooms()
}



const printRooms = () => {
    rooms.forEach(room => {
        console.log(room.roomId, room.users)
    }); 
}