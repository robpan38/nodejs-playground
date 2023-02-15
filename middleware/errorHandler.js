const { logEvent } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
    logEvent(`${err.name}: ${err.message}`, "errLogs.txt");
    res.status(500).send(err.message);
}

module.exports = errorHandler;