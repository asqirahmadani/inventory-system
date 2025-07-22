const Joi = require('joi');
const { ObjectId, password } = require('./custom.validation');

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        role: Joi.string()
    })
}

const queryUser = {
    params: Joi.object().keys({
        pagination: Joi.string().custom(ObjectId)
    })
}

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(ObjectId)
    })
}

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(ObjectId)
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            role: Joi.string()
        })
        .min(1)
}

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(ObjectId)
    })
}

module.exports = {
    createUser,
    queryUser,
    getUser,
    updateUser,
    deleteUser
}