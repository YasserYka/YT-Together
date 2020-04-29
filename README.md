# YT-API
This is a simple web application that allow mutiple clients to watch the same (synchronized) Youtube's videos and chat in the same time

# Technology used
- YouTube Player API 
- React
- Nodejs
- Websockets (ws library)

# How it should work
One user (controller) have the ablity to Pause/Play/Skip the video and these actions effect other users in the same room. The controller can give this contol to others by clicking on their names on the online-users list 

# How to run it
First start the nodejs application, with npm installed run
```
$ cd backend/ && npm start
```
Then start react application
```
$ cd frontend/ && npm start
```

# Contributing
Feel free to fix, suggest new features, clean some code or make the ugly frontend design prettier!
