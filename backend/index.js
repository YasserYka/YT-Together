const WebSocket = require('ws').Server, server  = require('http').createServer(), ACTIONS = require('./actions') ,EVENTS = require('./events');
const wss = new WebSocket({ server: server }), port = process.env.PORT || 8080, app = require('./http-server');
server.on('request', app);

let rooms = [];

setInterval(()=>{console.log(rooms.length)}, 10000)

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
    else if(event === EVENTS.CHAT)
        handleChatEvent(data, ws);
    else if(event === EVENTS.VIDEO_CONTROLLER)
        handleControllerEvent(data, ws);
}

const handleControllerEvent = data => {
    if(data.action === ACTIONS.ASSIGN)
        assignControllAction(data)
}

const assignControllAction = (data) => {
    let room = findRoomWithId(data.roomId);

    if(room)
        room.users.forEach(user => {

            if(user.username === data.toUsername){
                user.controller = true;
                sendMessageToUser({event: EVENTS.VIDEO_CONTROLLER, action: ACTIONS.CONTROLLER}, user.ws);
            }
            else if(user.username === data.username){
                user.controller = false;
                sendMessageToUser({event: EVENTS.VIDEO_CONTROLLER, action: ACTIONS.GUEST}, user.ws); 
            }

            sendMessageToUser({
                event: EVENTS.ONLINE,
                action: ACTIONS.NEW_CONTROLLER,
                username: data.toUsername
            }, user.ws);
        });
}

const sendMessageToUser = (message, ws) => {
    ws.send(JSON.stringify(message));
}

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
    let room = findRoomWithId(data.roomId);

    if(room)
        brodcastMessage(data, room.users, ws);
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
    else if(action === ACTIONS.LEAVE)
        leaveRoom(data, ws)
}

const createRoom = (data, ws) => {
    rooms.push({roomId: data.roomId, users: [{username: data.username, ws: ws, controller: true}]});
    ws.send(JSON.stringify({event: EVENTS.VIDEO_CONTROLLER, action: ACTIONS.CONTROLLER}));
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
    rooms.forEach((room, roomIndex, roomObject) => {
        room.users.forEach((user, userIndex, userObject) => {
            if(user.ws == ws){
                userObject.splice(userIndex, 1);

                if (userObject.length == 0)
                    roomObject.splice(roomIndex, 1);
                else if(user.controller){
                    room.users[0].controller = true;
                    sendMessageToUser({event: EVENTS.VIDEO_CONTROLLER, action: ACTIONS.CONTROLLER}, room.users[0].ws);
                }
                brodcastMessage({
                    event: EVENTS.ONLINE,
                    action: ACTIONS.LEAVE,
                    username: user.username
                }, room.users, ws);

                brodcastMessage({
                    event: EVENTS.ONLINE,
                    action: ACTIONS.NEW_CONTROLLER,
                    username: room.users[0].username
                }, room.users, ws);
            }
        });
    });

}

server.listen(port, () => {
    console.log(`Listening on ${port}!`);
});
