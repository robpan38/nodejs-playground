const path = require("path");
const PORT = process.env.PORT | 3500;
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));
app.use('/subdir', require("./routes/subdir"));
app.use('/api/employees', require("./routes/api/employees"));
app.use('/register', require("./routes/register"));
app.use('/login', require("./routes/login"));
app.use('/', require("./routes/root"));

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