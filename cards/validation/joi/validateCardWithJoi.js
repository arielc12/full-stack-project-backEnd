const Joi = require("joi");

const validateCardWithJoi = (card) => {
    const urlRegex =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const schema = Joi.object({
        title: Joi.string().min(2).max(256).required(),
        subtitle: Joi.string().min(2).max(256).optional().allow(""),
        images: Joi.array()
            .items(Joi.object({
                url: Joi.string()
                    .pattern(urlRegex)
                    .message('card.images "url" must be a valid URL')
                    .allow(""),
                alt: Joi.string().min(2).max(256).allow("").optional(),
            }))
            .required(),
        likesList: Joi.array().items(Joi.string()).optional(),
        commentsList: Joi.array().items(Joi.string()).optional(),
        ingredients: Joi.array()
            .items(Joi.object({
                name: Joi.string().required(),
                quantityInGrams: Joi.number().required(),
            }))
            .required(),
        instructionsList: Joi.array()
            .items(Joi.string().required())
            .required(),
        description: Joi.string().max(1024).optional().allow(""),
        ratings: Joi.array()
            .items(Joi.object({
                userId: Joi.string().required(),
                value: Joi.number().min(1).max(10).required(),
            }))
            .optional(),
        createdAt: Joi.date().optional(),
        user_id: Joi.string().required(),
    });

    return schema.validate(card);
};

module.exports = validateCardWithJoi;
