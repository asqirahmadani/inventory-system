const request = require('supertest');
const app = require('../../src/app');
const { status } = require('http-status');
const { orderOne, orderTwo, insertOrder } = require('../fixtures/order.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

describe('Order route', () => {
    describe('POST /v1/orders', () => {
        test('should return 201 and success create order if data valid and authorized', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).post('/v1/orders').send({
                userId: userOne.id
            }).set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.CREATED);
        });

        test('should return not found if user is not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/orders').send({
                userId: userOne.id
            }).set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).post('/v1/orders').send({
                userId: userOne.id
            }).set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should return bad request error if require field is missing', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).post('/v1/orders').send()
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    });

    describe('GET /v1/orders/pagination', () => {
        test('should return 200 if pagination is valid', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).get('/v1/orders/pagination?page=1&limit=2')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if pagination is invalid', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).get('/v1/orders/')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([userOne]);

            const res = await request(app).get('/v1/orders/pagination?page=1&limit=2')
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/orders/:orderId', () => {
        test('should return 200 if orderId exist and token is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);

            const res = await request(app).get(`/v1/orders/${orderOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if order is not exist', async () => {
            await insertOrder([orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/orders/${orderOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if orderId is invalid', async () => {
            await insertOrder([orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/orders/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([userOne]);

            const res = await request(app).get(`/v1/orders/${orderOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('PATCH /v1/orders/:orderId', () => {
        test('should return 200 if orderId exist, require field is valid and token is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);

            const res = await request(app).patch(`/v1/orders/${orderOne.id}`)
                .send({
                    totalPrice: 100
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if orderId is not exist', async () => {
            await insertOrder([orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).patch(`/v1/orders/${orderOne.id}`)
                .send({
                    totalPrice: 100
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if no field in body request', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).patch(`/v1/orders/${orderOne.id}`)
                .send()
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([userOne]);

            const res = await request(app).patch(`/v1/orders/${orderOne.id}`)
                .send({
                    totalPrice: 100
                })
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('DELETE /v1/orders/:orderId', () => {
        test('should return 200 if orderId is exist and token is valid', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);

            const res = await request(app).delete(`/v1/orders/${orderOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if order is not exist', async () => {
            await insertOrder([orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).delete(`/v1/orders/${orderOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if orderId is invalid', async () => {
            await insertOrder([orderTwo]);
            await insertUsers([admin]);

            const res = await request(app).delete(`/v1/orders/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if Bearer token is invalid, empty or user role is not allowed', async () => {
            await insertOrder([orderOne, orderTwo]);
            await insertUsers([userOne]);

            const res = await request(app).delete(`/v1/orders/${orderOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/orders/:orderId/order-items', () => {
        test('should return 200 if orderId valid, exist and authorized', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);

            const res = await request(app).get(`/v1/orders/${orderOne.id}/order-items`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if order not exist', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderTwo]);

            const res = await request(app).get(`/v1/orders/${orderOne.id}/order-items`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if user role is not allowed to access', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);

            const res = await request(app).get(`/v1/orders/${orderOne.id}/order-items`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should return bad request error if order Id is invalid Id', async () => {
            await insertUsers([admin, userOne, userTwo]);
            await insertOrder([orderOne, orderTwo]);

            const res = await request(app).get(`/v1/orders/invalidId/order-items`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    });
});