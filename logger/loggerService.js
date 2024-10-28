const morganLogger = require("./loggers/morganLogger");
const morgan = require("morgan");
const config = require("config");
const logger = config.get("LOGGER");

let loggerMiddleware;

if (logger === "morgan") {
    loggerMiddleware = morgan(morganLogger);
}
module.exports = loggerMiddleware;