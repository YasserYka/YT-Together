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

const brodcastMessage = (data, users, ws) => {
    users.forEach(user => {
        if(user.ws !== ws)
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
    rooms.forEach(room => {
        if(room.roomId === data.roomId)
            room.users.forEach(user => {
                if(user.username === data.toUsername){
                    user.haveControl = true;
                    user.ws.send(JSON.stringify({event: 'control', youHaveControl: true}));
                }
                else if(data.username == user.username){
                    user.haveControl = false;
                    user.ws.send(JSON.stringify({event: 'control', youHaveControl: false}));
                }
            });
    })
}

const handleChatEvent = (data, ws) => {
    rooms.forEach(room => {
        if(room.roomId === data.roomId)
            brodcastMessage(data, room.users, ws);
    });
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
    let roomNotFound = true, users;
    rooms.forEach(room => {
        if(room.roomId === data.roomId){
            users = room.users;
            roomNotFound = false;
            room.users.push({username: data.username, ws: ws, haveControl: false});
        }
    });
    
    if(roomNotFound)
        createRoom(data, ws);
    else
        notifyUsers(data, ws, users);

}
const notifyUsers = (data, ws, users) => {

    brodcastMessage({      
        event: 'online',
        action: 'joined',
        users: {username: data.username, haveControl: false}
    },  users, ws)

    let usernames = [];

    users.forEach(user => {
        if(user.ws != ws)
            usernames.push({username: user.username, haveControl: user.haveControl});
    });

    ws.send(JSON.stringify({      
        event: 'online',
        action: 'alreadyjoined',
        haveControl: false,
        users: usernames
    }));

}

const handleRoomEvent = (data, ws) => {

    //To make sure user not already registered
    rooms.forEach(room => {
        room.users.forEach((user, index) => {
            if(user.ws === ws)
                return;
        })
    })

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

    rooms.forEach(room => {
        room.users.forEach((user, index, object) => {
            if(user.ws === ws){
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
    ws.send(JSON.stringify({event: 'control', youHaveControl: true}));
}

const printRooms = () => {
    rooms.forEach(room => {
        console.log(room.roomId, room.users)
    }); 
}