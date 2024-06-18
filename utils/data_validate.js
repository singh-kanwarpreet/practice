const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().allow("", null),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required()
});


const Rschema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1),
    });


module.exports = {schema , Rschema};