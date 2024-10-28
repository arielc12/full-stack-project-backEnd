const Joi = require("joi");

const validateCommentWithJoi = (comment) => {
    const schema = Joi.object({
        userId: Joi.string().length(24).required(),
        body: Joi.string().min(1).max(1024).required(),
        dateTime: Joi.date().optional()
    });
    return schema.validate(comment);
};

module.exports = validateCommentWithJoi;
