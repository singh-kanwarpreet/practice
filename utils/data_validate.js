const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().allow("", null),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required()
});

module.exports = schema;