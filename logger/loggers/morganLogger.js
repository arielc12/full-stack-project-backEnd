const currentTime = require("../../utils/timeService");
const chalk = require("chalk");

const morganLogger = function (tokens, req, res) {
    const color = tokens.status(req, res) >= 400 ? "redBright" : "cyanBright";
    return chalk[color]([
        currentTime(),
        tokens.method(req, res),
        tokens.url(req, res),
        (tokens.status(req, res)), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' '))
};

module.exports = morganLogger;