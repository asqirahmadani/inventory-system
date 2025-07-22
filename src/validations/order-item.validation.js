const Joi = require('joi');
const { ObjectId } = require('./custom.validation');

const createOrderItem = {
    body: Joi.object().keys({
        orderId: Joi.string().required().custom(ObjectId),
        productId: Joi.string().required().custom(ObjectId),
        quantity: Joi.number().required()
    })
}

const queryOrderItem = {
    params: Joi.object().keys({
        paginate: Joi.string().custom(ObjectId)
    })
}

const getOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.string().custom(ObjectId)
    })
}

const updateOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.string().custom(ObjectId)
    }),
    body: Joi.object()
        .keys({
            orderId: Joi.string().custom(ObjectId),
            productId: Joi.string().custom(ObjectId),
            quantity: Joi.number(),
            unitPrice: Joi.number()
        })
        .min(1)
}

const deleteOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.string().custom(ObjectId)
    })
}

module.exports = {
    createOrderItem,
    queryOrderItem,
    getOrderItem,
    updateOrderItem,
    deleteOrderItem
}