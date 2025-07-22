const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { categoryOne, categoryTwo } = require('./category.fixture');
const { userOne, userTwo } = require('./user.fixture');

const productOne = {
    id: v4(),
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.finance.amount(5, 20)),
    quantityInStock: parseInt(faker.finance.amount(50, 100, 0)),
    categoryId: categoryOne.id,
    userId: userOne.id
}

const productTwo = {
    id: v4(),
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.finance.amount(5, 20)),
    quantityInStock: parseInt(faker.finance.amount(50, 100, 0)),
    categoryId: categoryTwo.id,
    userId: userTwo.id
}

const insertProduct = async (products) => {
    await prisma.product.createMany({
        data: products,
        skipDuplicates: true
    })
}

module.exports = {
    productOne,
    productTwo,
    insertProduct
}