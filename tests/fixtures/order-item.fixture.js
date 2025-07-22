const faker = require('faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma');
const { orderOne, orderTwo } = require('../fixtures/order.fixture');
const { productOne, productTwo } = require('../fixtures/product.fixture');

const orderItemOne = {
    id: v4(),
    orderId: orderOne.id,
    productId: productOne.id,
    quantity: parseInt(faker.finance.amount(1, 10, 0)),
    unitPrice: productOne.price
}

const orderItemTwo = {
    id: v4(),
    orderId: orderTwo.id,
    productId: productTwo.id,
    quantity: parseInt(faker.finance.amount(1, 10, 0)),
    unitPrice: productTwo.price
}

const insertOrderItem = async (orderItems) => {
    await prisma.orderItem.createMany({
        data: orderItems,
        skipDuplicates: true
    });
}

module.exports = {
    orderItemOne,
    orderItemTwo,
    insertOrderItem
}