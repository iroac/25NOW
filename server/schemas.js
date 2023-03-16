const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.todogroupSchema = Joi.object({
    _id: Joi.string(),
    Title: Joi.string().required().max(25).escapeHTML(),
    Itens: Joi.array().required().items(Joi.string().max(50).escapeHTML()),
    isArchive: Joi.boolean().required(),
    __v: Joi.number()
})