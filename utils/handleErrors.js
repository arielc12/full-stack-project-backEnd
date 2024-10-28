const chalk = require("chalk");

const createError = (validator, status, error) => {
    error.message = (validator + " Error: " + error.message);
    error.status = status || 400;
    throw new Error(error);
};

const handleError = (res, status, message = "") => {
    console.log((chalk.red(message)));
    return res.status(status).send(message);
};

module.exports = { createError, handleError };