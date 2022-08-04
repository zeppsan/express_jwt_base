const Joi = require('joi');
const constants = require('../config/constants').validation

/**
 * Registration data validation
 */
exports.registrationValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.alphanum': constants.alphga_numeric,
            'string.min': constants.too_short,
            'string.max': constants.too_long,
            'string.required': constants.field_required
        }),

    password: Joi.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
        .required()
        .messages({
            'string.pattern': constants.regex_missmatch,
            'string.required': constants.field_required
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.required': constants.field_required,
            'string.emails': constants.email
        })
})

/**
 * Login data validation
 */
exports.loginValidation = Joi.object({
    password: Joi.string()
        .required()
        .messages({
            'string.pattern': constants.regex_missmatch,
            'string.required': constants.field_required
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.required': constants.field_required,
            'string.emails': constants.email
        })
})