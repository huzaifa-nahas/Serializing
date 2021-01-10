import {
    Deserializer
} from './Serializing';

const WebSocket = require('ws');
const port = process.env.port ? process.env.port : 8081;
const server = new WebSocket.Server({
    port
});

server.on('connection', socket => {
    socket.on('message', message => {
        let deserializedCounter = Deserializer(message);
        deserializedCounter.increment();
        socket.send(deserializedCounter.count);
    });
});

server.on('error', err => {
    if (err.errno === 'EADDRINUSE')
        console.log("Error: Please either stop the receiver if it is already running, or select a port other than 8081 using a process environment variable!");
    else
        console.log(err);
});