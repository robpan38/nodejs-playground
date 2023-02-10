const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const path = require("path");

const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvent = async (message) => {
    let eventMessage = "";
    eventMessage += format(new Date(), "do MMMM yyyy | HH:mm:ss");
    eventMessage += "\n";
    eventMessage += `uuid: ${uuid()}`
    eventMessage += "\n";
    eventMessage += message;
    eventMessage += "\n";

    try {
        if (!fs.existsSync(path.join(__dirname, "output"))) {
            fs.mkdirSync(path.join(__dirname, "output"));
        }
        
        await fsPromises.appendFile(path.join(__dirname, "output", "logEvents.txt"), eventMessage);
    } catch (err) {
        console.log(err);
    }
}

module.exports = logEvent;