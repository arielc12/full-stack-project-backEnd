const config = require("config");
const validateCommentWithJoi = require("./joi/validateCommentWithJoi");
const validator = config.get("VALIDATOR");

const validateComment = (card) => {
    if (validator === "joi") {
        const { error } = validateCommentWithJoi(card);
        if (error) return error.details[0].message;
        return "";
    }
};

module.exports = validateComment;