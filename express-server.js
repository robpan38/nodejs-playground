const path = require("path");
const PORT = process.env.PORT | 3500;

const express = require("express");
const app = express();

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
})

app.get('/hello(.html)?', (req, res, next) => {
    next();
}, (req, res) => {
    res.send('Hello world!');
})

// array of handlers
const handler1 = (req, res, next) => {
    console.log('hello from handler 1');
    next();
}

const handler2 = (req, res, next) => {
    console.log('hello from handler 2');
    next();
}

const handler3 = (req, res) => {
    console.log('hello from handler 3');
    res.send('Chain of handlers!');
}

app.get('/chain(.html)?', [handler1, handler2, handler3]);

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(PORT, () => {
    console.log('listening on port 3500');
})