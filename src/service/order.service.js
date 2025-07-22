const prisma = require('../../prisma');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const { userService } = require('./index');
const paginate = require('../utils/paginate');

const createOrder = async (orderBody) => {
    const { userId } = orderBody;
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    const order = await prisma.order.create({
        data: {
            customerName: user.name,
            customerEmail: user.email,
            userId
        }
    });

    return order;
}

const queryOrder = async (filter) => {
    const page = parseInt(filter.page);
    const limit = parseInt(filter.limit);

    const result = await paginate({
        model: prisma.order,
        page: page,
        limit: limit
    });

    return result;
}

const getOrderById = (orderId) => {
    return prisma.order.findFirst({
        where: {
            id: orderId
        }
    });
}

const updateOrder = async (orderId, updateBody) => {
    const order = await getOrderById(orderId);
    if (!order) {
        throw new ApiError(status.NOT_FOUND, 'Order not found');
    }

    if (updateBody.userId) {
        const user = await userService.getUserById(updateBody.userId);
        if (!user) {
            throw new ApiError(status.NOT_FOUND, 'User not found');
        }

        if (updateBody.totalPrice) {
            const newPrice = updateBody.totalPrice;

            updateBody = {
                totalPrice: newPrice,
                customerName: user.name,
                customerEmail: user.email,
                userId: user.id
            }
        } else {
            updateBody = {
                customerName: user.name,
                customerEmail: user.email,
                userId: user.id
            }
        }
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId
        },
        data: updateBody
    });

    return updatedOrder;
}

const deleteOrder = async (orderId) => {
    const order = await getOrderById(orderId);
    if (!order) {
        throw new ApiError(status.NOT_FOUND, 'Order not found');
    }

    const deletedOrder = await prisma.order.delete({
        where: {
            id: orderId
        }
    });

    return deletedOrder;
}

const getOrderItemsByOrder = async (orderId) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { OrderItems: true }
    });

    return order;
}

module.exports = {
    createOrder,
    queryOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderItemsByOrder
}