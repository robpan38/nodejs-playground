const logEvent = require("./logEvents");
const EventEmitter = require("events");
class Emitter extends EventEmitter { };
const http = require("http");
const path = require("path");
const fs = require("fs");

let myEventEmitter = new Emitter();

myEventEmitter.on('log', (msg) => logEvent(msg));

const PORT = process.env.PORT || 3500;
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    const extension = path.extname(req.url);
    let basePathHtml = __dirname + "/views";
    let resourcePath = "";
    let contentType = '';

    switch(extension) {
        case '.html':
            resourcePath += basePathHtml + req.url;
            contentType = 'text/html';
            break;
        case '.css':
            resourcePath += __dirname + req.url;
            contentType = 'text/css';
            break;
        case '.js':
            resourcePath += __dirname + req.url;
            contentType = 'text/javascript';
            break;
        case '.txt':
            resourcePath += __dirname + req.url;
            contentType = 'text/plain';
            break;
        case '.json':
            resourcePath += __dirname + req.url;
            contentType = 'application/json';
            break;
        case '.png':
            resourcePath += __dirname + req.url;
            contentType = 'image/png';
            break;
        default:
            contentType = 'text/html';
            if (req.url.at(req.url.length - 1) === "/") {
                resourcePath = basePathHtml + req.url + "index.html";
            } else {
                resourcePath = basePathHtml + req.url + ".html";
            }
    }

    console.log(resourcePath);
    fs.readFile(resourcePath, (err, data) => {
        if (err) {
            // here a 500 error might happen that was not checked
            myEventEmitter.emit('log', `${err.name}: ${err.message}`);
            if (req.url !== "/favicon.icon") {
                fs.readFile(__dirname + "/views/404.html", (err, data) => {
                    res.statusCode = 404;
                    res.end(data);
                })
            }
        } else {
            myEventEmitter.emit('log', `${req.url}\t${req.method}`)
            res.writeHead(200, { 'Content-Type': contentType })
            if (contentType == 'application/json') {
                res.end(JSON.stringify(JSON.parse(data)));
            } else {
                res.end(data);
            }
        }
    })
});

server.listen(PORT, () => {
    console.log("astept request-uri pe port 3500");
})