const Joi = require('joi');
const { ObjectId } = require('./custom.validation');

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
    }),
};

const queryCategory = {
    params: Joi.object().keys({
        pagination: Joi.string().custom(ObjectId),
    }),
};

const getCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(ObjectId),
    }),
};

const updateCategory = {
    params: Joi.object().keys({
        categoryId: Joi.required().custom(ObjectId),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
        })
        .min(1),
};

const deleteCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(ObjectId),
    }),
};

module.exports = {
    createCategory,
    queryCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};