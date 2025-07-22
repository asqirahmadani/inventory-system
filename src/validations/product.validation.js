const Joi = require('joi');
const { ObjectId } = require('./custom.validation');

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        quantityInStock: Joi.number().required(),
        categoryId: Joi.string().required().custom(ObjectId)
    })
}

const queryProduct = {
    params: Joi.object().keys({
        paginate: Joi.string().custom(ObjectId)
    })
}

const getProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(ObjectId)
    })
}

const updateProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(ObjectId)
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            description: Joi.string(),
            price: Joi.number(),
            quantityInStock: Joi.number(),
            categoryId: Joi.string().custom(ObjectId)
        })
        .min(1)
}

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(ObjectId)
    })
}

const searchProductbyCategory = {
    query: Joi.object().keys({
        category: Joi.string().required()
    })
}

module.exports = {
    createProduct,
    getProduct,
    queryProduct,
    updateProduct,
    deleteProduct,
    searchProductbyCategory
}