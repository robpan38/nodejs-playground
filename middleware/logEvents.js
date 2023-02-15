const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const path = require("path");

const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvent = async (message, folderName) => {
    let eventMessage = "";
    eventMessage += format(new Date(), "do MMMM yyyy | HH:mm:ss");
    eventMessage += "\t";
    eventMessage += `uuid: ${uuid()}`
    eventMessage += "\t";
    eventMessage += message;
    eventMessage += "\n";

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            fs.mkdirSync(path.join(__dirname, "..", "logs"));
        }
        
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", folderName), eventMessage);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    console.log(`${req.url}\t${req.headers.origin}\t${req.method}`);
    logEvent(`${req.url}\t${req.headers.origin}\t${req.method}`, "reqLogs.txt");
    next();
};

module.exports = { logger, logEvent };