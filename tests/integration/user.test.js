const request = require('supertest');
const app = require('../../src/app');
const { status } = require('http-status');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

describe('User route', () => {
    describe('POST /v1/user', () => {
        test('should return 201 and success create user if data valid and authorized', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/users').send({
                name: userOne.name,
                email: userOne.email,
                password: userOne.password
            }).set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.CREATED);
        });

        test('should return unauthorized error if user role is forbidden to access', async () => {
            await insertUsers([userOne]);

            const res = await request(app).post('/v1/users').send({
                name: userOne.name,
                email: userOne.email,
                password: userOne.password
            }).set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should return bad request error if user email is duplicate', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/users').send({
                name: userOne.name,
                email: admin.email,
                password: userOne.password
            }).set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return validation error if require field is missing', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/users').send({
                name: userOne.name,
                password: userOne.password
            }).set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    });

    describe('GET /v1/users/pagination', () => {
        test('should return 200 if pagination is valid', async () => {
            await insertUsers([admin]);

            const res = await request(app).get('/v1/users/pagination?page=2&limit=2')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if pagination is invalid', async () => {
            await insertUsers([admin]);

            const res = await request(app).get('/v1/users/')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if user role is not allowed to access', async () => {
            await insertUsers([userOne]);

            const res = await request(app).get('/v1/users/pagination?page=2&limit=2')
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/users/:userId', () => {
        test('should return 200 if userId is exist, valid and user is authorized', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).get(`/v1/users/${userOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if user is not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/users/${userOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if user Id is invalid Id', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/users/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if user role is not allowed to access', async () => {
            await insertUsers([userOne, admin]);

            const res = await request(app).get(`/v1/users/${admin.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('PATCH /v1/users/:userId', () => {
        test('should return 200 if userId is exist, require field is valid and user is authorized', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).patch(`/v1/users/${userOne.id}`)
                .send({
                    name: userTwo.name,
                    email: userTwo.email,
                    password: userTwo.password
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if userId is not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).patch(`/v1/users/${userOne.id}`)
                .send({
                    name: userTwo.name,
                    email: userTwo.email,
                    password: userTwo.password
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if no field in body request', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).patch(`/v1/users/${userOne.id}`)
                .send().set('Authorization', `Bearer ${adminAccessToken}`)
            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return bad request error if email is duplicate other user', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).patch(`/v1/users/${userOne.id}`)
                .send({
                    email: admin.email
                }).set('Authorization', `Bearer ${adminAccessToken}`)
            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if user role is not allowed to access', async () => {
            await insertUsers([userOne, admin]);

            const res = await request(app).patch(`/v1/users/${admin.id}`)
                .send({
                    name: userTwo.name,
                    email: userTwo.email,
                    password: userTwo.password
                })
                .set('Authorization', `Bearer ${userOne}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('DELETE /v1/users/:userId', () => {
        test('should return 200 if userId is valid, exist and authorized', async () => {
            await insertUsers([userOne, admin]);

            const res = await request(app).delete(`/v1/users/${userOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if user not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).delete(`/v1/users/${userOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if userId is invalid', async () => {
            await insertUsers([userOne, admin]);

            const res = await request(app).delete(`/v1/users/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    });

    describe('GET /v1/users/:userId/products', () => {
        test('should return 200 if userId is valid, exist and authorized', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).get(`/v1/users/${userOne.id}/products`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if user not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/users/${userOne.id}/products`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if user role is not allowed to access', async () => {
            await insertUsers([userOne, admin]);

            const res = await request(app).get(`/v1/users/${admin.id}/products`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should return bad request error if user Id is invalid Id', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/users/invalidId/products`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    });

    describe('GET /v1/users/:userId/orders', () => {
        test('should return 200 if userId is valid, exist and authorized', async () => {
            await insertUsers([admin, userOne]);

            const res = await request(app).get(`/v1/users/${userOne.id}/orders`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if user not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/users/${userOne.id}/orders`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if user role is not allowed to access', async () => {
            await insertUsers([userOne, admin]);

            const res = await request(app).get(`/v1/users/${admin.id}/orders`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should return bad request error if user Id is invalid Id', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/users/invalidId/orders`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    })
});