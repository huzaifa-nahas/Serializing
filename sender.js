import {
    Serializer
} from './Serializing';

const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8081');

let counter = {
    count: 0,
    increment() {
        this.count++;
    }
}

socket.on('open', () => {
    counter.increment();
    let serializedCounter = Serializer(counter);
    socket.send(serializedCounter);
});

socket.on('message', data => {
    console.log(data);
});

socket.on('error', err => {
    if (err.errno === "ECONNREFUSED")
        console.log("Please run the receiver first!");
    else
        console.log(err);
});