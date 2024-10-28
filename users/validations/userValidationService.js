const registerValidation = require("./joi/registerValidation");
const loginValidation = require("./joi/loginValidation");
const config = require("config");
const editValidation = require("./joi/editValidation");
const validator = config.get("VALIDATOR");

const validateRegistration = (user) => {
    if (validator === "joi") {
        const { error } = registerValidation(user);
        if (error) return error.details[0].message;
        return "";
    }
};
const validateLogin = (user) => {
    if (validator === "joi") {
        const { error } = loginValidation(user);
        if (error) return error.details[0].message;
        return "";
    }
};
const validateEdit = (user) => {
    if (validator === "joi") {
        const { error } = editValidation(user);
        if (error) return error.details[0].message;
        return "";
    }
};


exports.validateRegistration = validateRegistration;
exports.validateLogin = validateLogin;
exports.validateEdit = validateEdit;