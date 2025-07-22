const request = require('supertest');
const app = require('../../src/app');
const { status } = require('http-status');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, categoryTwo, insertCategory } = require('../fixtures/category.fixture');

describe('Category route', () => {
    describe('POST /v1/categorys', () => {
        test('should return 201 and success create category if data valid and authorized', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/categorys').send({
                name: categoryOne.name
            }).set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.CREATED);
        });

        test('should unauthorized error if Bearer token is invalid or empty', async () => {
            await insertUsers([userOne]);

            const res = await request(app).post('/v1/categorys').send({
                name: categoryOne.name
            }).set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should return bad request error if require field is missing', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/categorys').send()
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });
    });

    describe('GET /v1/categorys/pagination', () => {
        test('should return 200 if pagination is valid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne, categoryTwo]);

            const res = await request(app).get('/v1/categorys/pagination?page=1&limit=2')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if pagination is invalid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne, categoryTwo]);

            const res = await request(app).get('/v1/categorys/')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if token is invalid', async () => {
            await insertUsers([userOne]);
            await insertCategory([categoryOne, categoryTwo]);

            const res = await request(app).get('/v1/categorys/pagination?page=1&limit=2')
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/categorys/:categoryId', () => {
        test('should return 200 if categoryId is exist and token is valid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne, categoryTwo]);

            const res = await request(app).get(`/v1/categorys/${categoryOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if category is not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).get(`/v1/categorys/${categoryOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if categoryId is invalid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryTwo]);

            const res = await request(app).get(`/v1/categorys/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if token is invalid or empty', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryTwo]);

            const res = await request(app).get(`/v1/categorys/invalidId`)
                .set('Authorization', `Bearer `);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('PATCH /v1/categorys/:categoryId', () => {
        test('should return 200 if categoryId is exist, require field is valid and token is valid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne]);

            const res = await request(app).patch(`/v1/categorys/${categoryOne.id}`)
                .send({
                    name: categoryTwo.name
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if categoryId is not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).patch(`/v1/categorys/${categoryTwo.id}`)
                .send({
                    name: categoryTwo.name
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if no field in body request', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne]);

            const res = await request(app).patch(`/v1/categorys/${categoryTwo.id}`)
                .send().set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if token is invalid or bearer token is empty', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne]);

            const res = await request(app).patch(`/v1/categorys/${categoryTwo.id}`)
                .send().set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('DELETE /v1/categorys/:categoryId', () => {
        test('should return 200 if categoryId is exist, valid and token is valid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne]);

            const res = await request(app).delete(`/v1/categorys/${categoryOne.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if category not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).delete(`/v1/categorys/${categoryTwo.id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if categoryId is invalid', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne]);

            const res = await request(app).delete(`/v1/categorys/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if token is invalid or bearer token is empty', async () => {
            await insertUsers([admin]);
            await insertCategory([categoryOne]);

            const res = await request(app).delete(`/v1/categorys/invalidId`)
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });
});