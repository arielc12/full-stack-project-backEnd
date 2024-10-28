const Joi = require("joi");

const registerValidation = (user) => {
  const schema = Joi.object({
    name: Joi.object()
      .keys({
        first: Joi.string().min(2).max(256).required(),
        middle: Joi.string().min(2).max(256).allow(""),
        last: Joi.string().min(2).max(256).required(),
      })
      .required(),
    email: Joi.string()
      .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      .message('User "email" must be a valid email address.')
      .required(),
    password: Joi.string()
      .pattern(/((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-]).{7,20})/)
      .message('User "password" must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and one of the following characters !@#$%^&*-')
      .required(),
    profilePicture: Joi.object()
      .keys({
        url: Joi.string()
          .pattern(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/)
          .message("Profile picture must be a valid URL.")
          .allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
      })
      .allow(null),
    backgroundPicture: Joi.object()
      .keys({
        url: Joi.string()
          .pattern(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/)
          .message("Background picture must be a valid URL.")
          .allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
      })
      .allow(null),
    isAdmin: Joi.boolean().required(),
    followers: Joi.array().items(Joi.string()).optional(),
    following: Joi.array().items(Joi.string()).optional(),
  });
  return schema.validate(user);
};

module.exports = registerValidation;
