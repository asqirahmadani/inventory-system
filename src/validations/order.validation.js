const Joi = require('joi');
const { ObjectId } = require('./custom.validation');

const createOrder = {
    body: Joi.object().keys({
        userId: Joi.string().required().custom(ObjectId)
    })
}

const queryOrder = {
    params: Joi.object().keys({
        pagination: Joi.string().custom(ObjectId)
    })
}

const getOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(ObjectId)
    })
}

const updateOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(ObjectId)
    }),
    body: Joi.object()
        .keys({
            userId: Joi.string().custom(ObjectId),
            totalPrice: Joi.number()
        })
        .min(1)
}

const deleteOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(ObjectId)
    })
}

module.exports = {
    createOrder,
    queryOrder,
    getOrder,
    updateOrder,
    deleteOrder
}