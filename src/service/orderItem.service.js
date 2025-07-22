const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const paginate = require('../utils/paginate');
const { orderService, productService } = require('./index');

const createOrderItem = async (orderItemBody) => {
    const order = await orderService.getOrderById(orderItemBody.orderId);
    const product = await productService.getProductById(orderItemBody.productId);

    if (!order || !product) {
        throw new ApiError(status.NOT_FOUND, 'Order or Product not found!');
    }

    if (orderItemBody.quantity > product.quantityInStock) {
        throw new ApiError(status.BAD_REQUEST, 'Not enough stocks');
    }

    const orderItem = await prisma.orderItem.create({
        data: {
            orderId: order.id,
            productId: product.id,
            quantity: orderItemBody.quantity,
            unitPrice: product.price
        }
    });

    // update totalPrice di order
    const subtotal = orderItem.quantity * orderItem.unitPrice;
    await prisma.order.update({
        where: { id: order.id },
        data: {
            totalPrice: {
                increment: subtotal
            }
        }
    });

    // quantity di product dikurangi
    await prisma.product.update({
        where: { id: orderItem.productId },
        data: {
            quantityInStock: {
                decrement: orderItem.quantity
            }
        }
    });

    return orderItem;
}

const queryOrderItem = async (filter) => {
    const page = parseInt(filter.page);
    const limit = parseInt(filter.limit);

    const result = await paginate({
        model: prisma.orderItem,
        page: page,
        limit: limit
    });

    return result;
}

const getOrderItemById = async (orderItemId) => {
    return prisma.orderItem.findUnique({
        where: {
            id: orderItemId
        }
    });
}

const updateOrderItem = async (orderItemId, updateBody) => {
    return prisma.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.findUnique({
            where: { id: orderItemId },
            include: { product: true }
        });

        if (!orderItem) {
            throw new ApiError(status.NOT_FOUND, 'OrderItem not found');
        }

        const oldProductId = orderItem.productId;
        const oldOrderId = orderItem.orderId;
        const oldQuantity = orderItem.quantity;
        const oldUnitPrice = orderItem.unitPrice;
        const oldTotal = oldQuantity * oldUnitPrice;

        let newProductId = updateBody.productId ?? oldProductId;
        let newOrderId = updateBody.orderId ?? oldOrderId;
        let newQuantity = updateBody.quantity ?? oldQuantity;
        let newUnitPrice = updateBody.unitPrice;

        let newProduct;
        if (newProductId !== oldProductId) {
            newProduct = await tx.product.findUnique({ where: { id: newProductId } });
            if (!newProduct) throw new ApiError(status.NOT_FOUND, 'New product not found');
        } else {
            newProduct = orderItem.product;
        }

        if (newUnitPrice === undefined) {
            newUnitPrice = newProduct.price;
        }

        const newTotal = newQuantity * newUnitPrice;

        // kembalikan stock lama
        await tx.product.update({
            where: { id: oldProductId },
            data: { quantityInStock: { increment: oldQuantity } }
        });

        // cek ketersediaan stock, kurangi stock jika memenuhi
        if (newQuantity > orderItem.product.quantityInStock) {
            throw new ApiError(status.BAD_REQUEST, 'Not enough stocks');
        }

        await tx.product.update({
            where: { id: newProductId },
            data: { quantityInStock: { decrement: newQuantity } }
        });

        // jika orderId berubah maka update totalPrice di order lama dan order baru
        if (newOrderId !== oldOrderId) {
            await tx.order.update({
                where: { id: oldOrderId },
                data: { totalPrice: { decrement: oldTotal } }
            });

            await tx.order.update({
                where: { id: newOrderId },
                data: { totalPrice: { increment: newTotal } }
            });
        } else {
            const delta = newTotal - oldTotal;
            await tx.order.update({
                where: { id: oldOrderId },
                data: { totalPrice: { increment: delta } }
            });
        }

        // update order item
        const updatedOrderItem = await tx.orderItem.update({
            where: { id: orderItemId },
            data: {
                orderId: newOrderId,
                productId: newProductId,
                quantity: newQuantity,
                unitPrice: newUnitPrice
            }
        });

        return updatedOrderItem;
    });
}

const deleteOrderItem = async (orderItemId) => {
    const orderItem = await getOrderItemById(orderItemId);
    if (!orderItem) {
        throw new ApiError(status.NOT_FOUND, 'Order Item not found');
    }

    // update totalPrice di order
    await prisma.order.update({
        where: { id: orderItem.orderId },
        data: {
            totalPrice: {
                decrement: orderItem.quantity * orderItem.unitPrice
            }
        }
    });

    // update quantity di product
    await prisma.product.update({
        where: { id: orderItem.productId },
        data: { quantityInStock: { increment: orderItem.quantity } }
    });

    const deletedOrderItem = await prisma.orderItem.delete({
        where: {
            id: orderItemId
        }
    });

    return deletedOrderItem;
}

module.exports = {
    createOrderItem,
    queryOrderItem,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem
}