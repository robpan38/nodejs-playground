const path = require("path");
const PORT = process.env.PORT | 3500;
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger);

const whitelist = ["https://www.google.ro"];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSucccessStatus: 200,
};
app.use(cors(corsOptions));

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

app.all('*', (req, res) => {
    if (req.accepts("html")) {
        res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts("json")) {
        res.status(404).json({ error: "Resource not found." });
    } else {
        res.status(404).type("text").send("Resource not found.");
    }
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('listening on port 3500');
})