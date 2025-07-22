const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderItemValidation = require('../../validations/order-item.validation');
const orderItemController = require('../../controller/orderItem.controller');

const router = express.Router();

router
    .route('/')
    .post(auth('admin'), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)

router.get('/pagination', auth('admin'), validate(orderItemValidation.queryOrderItem), orderItemController.queryOrderItem)

router
    .route('/:orderItemId')
    .get(auth('admin'), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
    .patch(auth('admin'), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
    .delete(auth('admin'), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem)

module.exports = router;