const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { userOne, userTwo } = require('./user.fixture');

const orderOne = {
    id: v4(),
    customerName: userOne.name,
    customerEmail: userOne.email,
    userId: userOne.id
}

const orderTwo = {
    id: v4(),
    customerName: userTwo.name,
    customerEmail: userTwo.email,
    userId: userTwo.id
}

const insertOrder = async (orders) => {
    await prisma.order.createMany({
        data: orders,
        skipDuplicates: true
    });
}

module.exports = {
    orderOne,
    orderTwo,
    insertOrder
}