const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controller/order.controller');

const router = express.Router();

router
    .route('/')
    .post(auth('admin'), validate(orderValidation.createOrder), orderController.createOrder)

router.get('/pagination', auth('admin'), validate(orderValidation), orderController.queryOrders)

router
    .route('/:orderId')
    .get(auth('admin'), validate(orderValidation.getOrder), orderController.getOrder)
    .patch(auth('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
    .delete(auth('admin'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

router.get('/:orderId/order-items', auth('admin'), validate(orderValidation.getOrder), orderController.getOrderItemsByOrder);

module.exports = router;