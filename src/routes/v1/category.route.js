const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controller/category.controller');

const router = express.Router();

router
    .route('/')
    .post(auth(['admin', 'user']), validate(categoryValidation.createCategory), categoryController.createCategory)

router.get('/pagination', auth(['admin', 'user']), validate(categoryValidation.queryCategory), categoryController.getCategorys);

router
    .route('/:categoryId')
    .get(auth(['admin', 'user']), validate(categoryValidation.getCategory), categoryController.getCategoryById)
    .patch(auth(['admin', 'user']), validate(categoryValidation.updateCategory), categoryController.updateCategory)
    .delete(auth(['admin', 'user']), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;