const request = require('supertest');
const app = require('../../src/app');
const { status } = require('http-status');
const { orderOne, orderTwo, insertOrder } = require('../fixtures/order.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { productOne, productTwo, insertProduct } = require('../fixtures/product.fixture');
const { categoryOne, categoryTwo, insertCategory } = require('../fixtures/category.fixture');
const { orderItemOne, orderItemTwo, insertOrderItem } = require('../fixtures/order-item.fixture');

describe('Order-Item route', () => {
    describe('POST /v1/order-items', () => {
        test('should return 201 and success create order-item if data valid and authorized', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).post('/v1/order-items')
                .send({
                    orderId: orderOne.id,
                    productId: productOne.id,
                    quantity: orderItemOne.quantity
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.CREATED);
        });

        test('should return not found error if orderId or productId is not exist', async () => {
            await insertUsers([admin, userOne, userTwo]);

            const res = await request(app).post('/v1/order-items')
                .send({
                    orderId: orderOne.id,
                    productId: productOne.id,
                    quantity: orderItemOne.quantity
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if require field is missing', async () => {
            await insertUsers([admin, userOne, userTwo]);

            const res = await request(app).post('/v1/order-items')
                .send()
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return bad request error if quantity is greater than product stock', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).post('/v1/order-items')
                .send({
                    orderId: orderOne.id,
                    productId: productOne.id,
                    quantity: 150
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).post('/v1/order-items')
                .send({
                    orderId: orderOne.id,
                    productId: productOne.id,
                    quantity: orderItemOne.quantity
                })
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/order-items/pagination', () => {
        test('should return 200 if pagination is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);

            const res = await request(app).get('/v1/order-items/pagination?page=1&limit=2')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if pagination is invalid', async () => {
            await insertUsers([admin, userOne, userTwo]);

            const res = await request(app).get('/v1/order-items/')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertUsers([admin, userOne, userTwo]);

            const res = await request(app).get('/v1/order-items/pagination?page=1&limit=2')
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/order-items/:orderItemId', () => {
        test('should return 200 if orderItemId is exist and token is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertProduct([productOne, productTwo]);
            await insertOrderItem([orderItemOne, orderItemTwo]);

            const res = await request(app).get(`/v1/order-items/${orderItemOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if order-item is not exist', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemTwo]);

            const res = await request(app).get(`/v1/order-items/${orderItemOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if orderItemId is invalid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemTwo]);

            const res = await request(app).get(`/v1/order-items/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemOne, orderItemTwo]);

            const res = await request(app).get(`/v1/order-items/${orderItemOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('PATCH /v1/order-items/:orderItemId', () => {
        test('should return 200 if orderItemId exist, require field is valid and token is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertOrderItem([orderItemOne]);

            const res = await request(app).patch(`/v1/order-items/${orderItemOne.id}`)
                .send({
                    orderId: orderTwo.id,
                    productId: productTwo.id,
                    quantity: orderItemTwo.quantity
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if productId is not exist', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertProduct([productOne, productTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertOrderItem([orderItemTwo]);

            const res = await request(app).patch(`/v1/order-items/${orderItemOne.id}`)
                .send({
                    orderId: orderOne.id,
                    productId: productOne.id,
                    quantity: orderItemOne.quantity
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if no field in body request', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemOne, orderItemTwo]);

            const res = await request(app).patch(`/v1/order-items/${orderItemOne.id}`)
                .send()
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return bad request error if quantity is greater than product stock', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertOrderItem([orderItemOne]);

            const res = await request(app).patch(`/v1/order-items/${orderItemOne.id}`)
                .send({
                    quantity: 200
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertOrderItem([orderItemOne]);

            const res = await request(app).patch(`/v1/order-items/${orderItemOne.id}`)
                .send({
                    orderId: orderTwo.id,
                    productId: productTwo.id,
                    quantity: orderItemTwo.quantity
                })
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('DELETE /v1/order-items/:orderItemId', () => {
        test('should return 200 if orderItemId id exist, valid and token is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);
            await insertOrder([orderOne, orderTwo]);
            await insertOrderItem([orderItemOne, orderItemTwo]);

            const res = await request(app).delete(`/v1/order-items/${orderItemOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if order-item not exist', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemTwo]);

            const res = await request(app).delete(`/v1/order-items/${orderItemOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if productId is invalid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemTwo]);

            const res = await request(app).delete(`/v1/order-items/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrderItem([orderItemOne, orderItemTwo]);

            const res = await request(app).delete(`/v1/order-items/${orderItemOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });
});