const WebSocket = require('ws').Server, server  = require('http').createServer(), ACTIONS = require('./actions') ,EVENTS = require('./events');
const wss = new WebSocket({ server: server }), port = process.env.PORT || 8080, app = require('./http-server');
server.on('request', app);

let rooms = []

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(JSON.parse(message));
        handleMessage(JSON.parse(message), ws);
    });
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
    if(event === EVENTS.ROOM)
        handleRoomEvent(data, ws);
    else if(event === EVENTS.SYNCHRONIZE)
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
                user.controller = true;
                user.ws.send(JSON.stringify({event: 'control', controller: user.controller}));
            }
            else if(data.username == user.username){
                user.controller = false;
                user.ws.send(JSON.stringify({event: 'control', controller: user.controller}));
            }

            sendMessageToUser({
                event: 'online',
                action: 'newcontroller',
                username: data.toUsername
            }, ws);
        });
}

const sendMessageToUser = (message, ws) => {
    ws.send(JSON.stringify(message));
}

const findRoomWithId = id => {
    let roomFound;

    rooms.forEach(room => {
        if(room.roomId === id){
            roomFound = room;

        }
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

const handleJoinedUser = (data, ws, users) => {

    // send controller to all users already in the room about the new joined user
    brodcastMessage({      
        event: EVENTS.ONLINE,
        action: ACTIONS.JOIN,
        users: {username: data.username, controller: false}
    },  users, ws)

    let online_users_list = [];

    users.forEach(user => {
        if(user.ws != ws)
            online_users_list.push({username: user.username, controller: user.controller});
    });

    // send list of users already in the room to the new user
    sendMessageToUser({      
        event: EVENTS.ONLINE,
        action: ACTIONS.ONLINE_USERS_LIST,
        users: online_users_list
    }, ws);
}

const handleRoomEvent = (data, ws) => {
    let action = data.action;
    if(action === ACTIONS.CREATE)
        createRoom(data, ws);
    else if(action === ACTIONS.JOIN)
        joinRoom(data, ws);
    else if(action === 'leave')
        leaveRoom(data, ws)
}

const createRoom = (data, ws) => {
    rooms.push({roomId: data.roomId, users: [{username: data.username, ws: ws, controller: true}]});
    ws.send(JSON.stringify({event: 'control', action: ACTIONS.CONTROLLER}));
}

const joinRoom = (data, ws) => {
    let room = findRoomWithId(data.roomId);

    if(room){
        room.users.push({username: data.username, ws: ws, controller: false});
        handleJoinedUser(data, ws, room.users);
    } else
        createRoom(data, ws);
}

const leaveRoom = (data, ws) => {

    // remove user from it's room and sends notification to others
    rooms.forEach(room => {
        room.users.forEach((user, index, object) => {
            if(user.ws == ws){
                object.splice(index, 1);

                brodcastMessage({
                    event: EVENTS.ONLINE,
                    action: ACTIONS.LEAVE,
                    username: data.username
                }, room.users, ws);
            }
        });
    });

}

server.listen(port, () => {
    console.log(`Listening on ${port}!`);
});
