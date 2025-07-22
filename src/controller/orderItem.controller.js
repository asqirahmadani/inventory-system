const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService } = require('../service');

const createOrderItem = catchAsync(async (req, res) => {
    const orderItem = await orderItemService.createOrderItem(req.body);

    res.status(status.CREATED).send({
        status: status.CREATED,
        message: 'Create order item success',
        data: orderItem
    });
});

const queryOrderItem = catchAsync(async (req, res) => {
    const result = await orderItemService.queryOrderItem(req.query);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get order items success',
        data: result
    });
});

const getOrderItem = catchAsync(async (req, res) => {
    const result = await orderItemService.getOrderItemById(req.params.orderItemId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Order Item not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get order item success',
        data: result
    });
});

const updateOrderItem = catchAsync(async (req, res) => {
    const result = await orderItemService.updateOrderItem(req.params.orderItemId, req.body);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Update order item success',
        data: result
    });
});

const deleteOrderItem = catchAsync(async (req, res) => {
    await orderItemService.deleteOrderItem(req.params.orderItemId);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Delete order item success',
        data: null
    });
});

module.exports = {
    createOrderItem,
    queryOrderItem,
    getOrderItem,
    updateOrderItem,
    deleteOrderItem
}