const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controller/product.controller');

const router = express.Router();

router
    .route('/')
    .post(auth(['admin', 'user']), validate(productValidation.createProduct), productController.createProduct)

router.get('/pagination', auth(['admin', 'user']), validate(productValidation.queryProduct), productController.getProducts);
router.get('/search', auth(['admin', 'user']), validate(productValidation.searchProductbyCategory), productController.searchProductbyCategory);

router
    .route('/:productId')
    .get(auth(['admin', 'user']), validate(productValidation.getProduct), productController.getProductById)
    .patch(auth(['admin', 'user']), validate(productValidation.updateProduct), productController.updateProduct)
    .delete(auth(['admin', 'user']), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;