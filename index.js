const logEvent = require("./logEvents");
const EventEmitter = require("events");

class MyEventEmitter extends EventEmitter { };

let myEventEmitter = new MyEventEmitter();
myEventEmitter.on('log', (msg) => logEvent(msg));

setTimeout(() => {
    myEventEmitter.emit('log', 'cainele mananca salam');
}, 2000);