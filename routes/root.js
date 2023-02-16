const express = require("express");
const path = require("path");
const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
})

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');
})

router.get('/hello(.html)?', (req, res, next) => {
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

router.get('/chain(.html)?', [handler1, handler2, handler3]);

module.exports = router;