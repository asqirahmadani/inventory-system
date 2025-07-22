const { status } = require('http-status');
const { orderService } = require('../service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.body);

    res.status(status.CREATED).send({
        status: status.CREATED,
        message: 'Create order success',
        data: order
    });
});

const queryOrders = catchAsync(async (req, res) => {
    const result = await orderService.queryOrder(req.query);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get orders success',
        data: result
    });
})

const getOrder = catchAsync(async (req, res) => {
    const result = await orderService.getOrderById(req.params.orderId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Order not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get order success',
        data: result
    });
})

const updateOrder = catchAsync(async (req, res) => {
    const result = await orderService.updateOrder(req.params.orderId, req.body);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Update order success',
        data: result
    });
})

const deleteOrder = catchAsync(async (req, res) => {
    await orderService.deleteOrder(req.params.orderId);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Delete order success',
        data: null
    });
});

const getOrderItemsByOrder = catchAsync(async (req, res) => {
    const result = await orderService.getOrderItemsByOrder(req.params.orderId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Order not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get order items by order success',
        data: result
    });
});

module.exports = {
    createOrder,
    queryOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    getOrderItemsByOrder
}