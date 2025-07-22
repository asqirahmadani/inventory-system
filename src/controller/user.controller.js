const { status } = require('http-status');
const { userService } = require('../service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);

    res.status(status.CREATED).send({
        status: status.CREATED,
        message: 'Create user success',
        data: user
    });
});

const getUsers = catchAsync(async (req, res) => {
    const result = await userService.queryUser(req.query);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get users success',
        data: result
    });
});

const getUserById = catchAsync(async (req, res) => {
    const result = await userService.getUserById(req.params.userId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'User not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get user success',
        data: result
    });
});

const updateUser = catchAsync(async (req, res) => {
    const result = await userService.updateUser(req.params.userId, req.body);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Update user success',
        data: result
    });
});

const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.userId);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Delete user success',
        data: null
    });
});

const getProductByUser = catchAsync(async (req, res) => {
    const result = await userService.getProductByUser(req.params.userId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'User not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get product by user success',
        data: result
    });
});

const getOrdersByUser = catchAsync(async (req, res) => {
    const result = await userService.getOrdersByUser(req.params.userId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get orders by user success',
        data: result
    });
})

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
    getProductByUser,
    getOrdersByUser
}