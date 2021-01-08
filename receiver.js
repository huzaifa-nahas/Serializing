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
        let deserlizedCounter = Deserializer(message);
        deserlizedCounter.increment();
        socket.send(deserlizedCounter.count);
    });
});