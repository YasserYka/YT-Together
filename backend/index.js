const WebSocket = require('ws').Server, server  = require('http').createServer();
const wss = new WebSocket({ server: server }), port = process.env.PORT || 8080, app = require('./http-server');
server.on('request', app);

let rooms = []

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(JSON.parse(message));
        handleMessage(JSON.parse(message), ws);
    });
});

server.listen(port, () => {
    console.log(`Listening on ${port}!`);
});

//Sends Data-Payload to all users in specific room except the sender 
const brodcastMessage = (data, users, ws) => {
    users.forEach(user => {
        if(user.ws != ws)
            user.ws.send(JSON.stringify(data));
    });
}

const handleMessage = (data, ws) => {
    let event = data.event;
    if(event === 'room')
        handleRoomEvent(data, ws);
    else if(event === 'sync')
        handleSyncEvent(data, ws);
    else if(event === 'chat')
        handleChatEvent(data, ws);
    else if(event === 'control')
        handleControllerEvent(data, ws);
}

const handleControllerEvent = (data, ws) => {
    if(data.action === 'assign')
        assignControllAction(data)
}

const assignControllAction = (data) => {
    let room = findRoomWithId(data.roomId);

    if(room)
        room.users.forEach(user => {

            if(user.username === data.toUsername){
                user.haveControl = true;
                user.ws.send(JSON.stringify({event: 'control', action: 'youhavecontrol', youHaveControl: user.haveControl}));
            }
            else if(data.username == user.username){
                user.haveControl = false;
                user.ws.send(JSON.stringify({event: 'control', action: 'youhavecontrol', youHaveControl: user.haveControl}));
            }

            sendMessageToUser({
                event: 'online',
                action: 'newcontroller',
                username: data.toUsername
            }, ws);
        });
}

const sendMessageToUser = (message, ws) => ws.send(JSON.stringify(message));

const findRoomWithId = id => {
    let roomFound;

    rooms.forEach(room => {
        if(room.roomId === id)
            roomFound = room;
    });

    return roomFound;
}

const handleChatEvent = (data, ws) => {
    let room = findRoomWithId(data.roomId);

    if(room)
        brodcastMessage(data, room.users, ws);
}

const handleSyncEvent = (data, ws) => {
    rooms.forEach(room => {
        room.users.forEach(user => {
            if(user.ws == ws)
                brodcastMessage(data, room.users, ws);
        });
    });
}

const joinRoom = (data, ws) => {
    let room = findRoomWithId(data.roomId);

    if(room){
        room.users.push({username: data.username, ws: ws, haveControl: false});
        notifyUsers(data, ws, room.users);
    } else
        createRoom(data, ws);
}

//Notify users if user joined their room
const notifyUsers = (data, ws, users) => {

    brodcastMessage({      
        event: 'online',
        action: 'joined',
        users: {username: data.username, haveControl: false}
    },  users, ws)

    let usersPyload = [];

    users.forEach(user => {
        if(user.ws != ws)
        usersPyload.push({username: user.username, haveControl: user.haveControl});
    });

    sendMessageToUser({      
        event: 'online',
        action: 'alreadyjoined',
        haveControl: false,
        users: usersPyload
    }, ws);
}

const handleRoomEvent = (data, ws) => {
    let action = data.action;
    if(action === 'create')
        createRoom(data, ws);
    else if(action === 'join')
        joinRoom(data, ws);
    else if(action === 'leave')
        leaveRoom(data, ws)
}

const leaveRoom = (data, ws) => {
    let users;

    //Remove user from it's room and sends notification to others
    rooms.forEach(room => {
        room.users.forEach((user, index, object) => {
            if(user.ws == ws){
                users = room.users;
                object.splice(index, 1);
            }
            else
                brodcastMessage({
                    event: 'online',
                    action: 'left',
                    username: data.username
                }, room.users, ws);
        })
    })
}

const createRoom = (data, ws) => {
    rooms.push({roomId: data.roomId, users: [{username: data.username, ws: ws, haveControl: true}]});
    ws.send(JSON.stringify({event: 'control', action: 'youhavecontrol', youHaveControl: true}));
}
