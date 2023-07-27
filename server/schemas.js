const Joi = require('joi')

module.exports.todogroupSchema = Joi.object({
    _id: Joi.string(),
    Title: Joi.string().required().max(25),
    Itens: Joi.array().required().items(Joi.string().max(50)),
    author: Joi.string().required(),
    isArchive: Joi.boolean().required(),
    __v: Joi.number()
})