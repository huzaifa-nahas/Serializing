const WebSocket = require('ws');
const port = process.env.port ? process.env.port : 8081;
const server = new WebSocket.Server({
    port
});

const {
    Deserializer
} = require('./Serializing');

server.on('connection', socket => {
    socket.on('message', message => {
        let deserializedCounter = Deserializer(message);
        deserializedCounter.increment();
        socket.send(deserializedCounter.count);
    });
});