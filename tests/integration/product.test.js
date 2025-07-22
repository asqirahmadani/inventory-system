const request = require('supertest');
const app = require('../../src/app');
const { status } = require('http-status');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, categoryTwo, insertCategory } = require('../fixtures/category.fixture');
const { productOne, productTwo, insertProduct } = require('../fixtures/product.fixture');

describe('Product route', () => {
    describe('POST /v1/products', () => {
        test('should return 201 and success create product if data valid and authorized', async () => {
            await insertUsers([userOne]);
            await insertCategory(categoryOne)

            const res = await request(app).post('/v1/products')
                .send({
                    name: productOne.name,
                    description: productOne.description,
                    price: productOne.price,
                    quantityInStock: productOne.quantityInStock,
                    categoryId: productOne.categoryId
                })
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.CREATED);
        });

        test('should return not found error if userId or categoryId is not exist', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/products')
                .send({
                    name: productOne.name,
                    description: productOne.description,
                    price: productOne.price,
                    quantityInStock: productOne.quantityInStock,
                    categoryId: productOne.categoryId
                })
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if require field is missing', async () => {
            await insertUsers([admin]);

            const res = await request(app).post('/v1/products')
                .send()
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if token is invalid', async () => {
            await insertUsers([admin, userOne]);
            await insertCategory(categoryOne);

            const res = await request(app).post('/v1/products')
                .send(productOne)
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/products/pagination', () => {
        test('should return 200 if pagination is valid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get('/v1/products/pagination?page=1&limit=2')
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if pagination is invalid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get('/v1/products/')
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if token is invalid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get('/v1/products/pagination?page=1&limit=2')
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/products/search', () => {
        test('should return 200 if data and token is valid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get(`/v1/products/search?category=${categoryOne.name}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if category is not exist', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get(`/v1/products/search?category=${categoryOne.name}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return unauthorized error if token is invalid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get(`/v1/products/search?category=${categoryOne.name}`)
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('GET /v1/products/:productId', () => {
        test('should return 200 if productId is exist and token is valid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get(`/v1/products/${productOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if product is not exist', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productTwo]);

            const res = await request(app).get(`/v1/products/${productOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if productId is invalid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get(`/v1/products/invalidId`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if token is invalid or empty', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).get(`/v1/products/invalidId`)
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('PATCH /v1/products/:productId', () => {
        test(' should return 200 if productId exist, require field is valid and token is valid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).patch(`/v1/products/${productOne.id}`)
                .send({
                    quantityInStock: productTwo.quantityInStock
                })
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test(' should return not found error if productId is not exist', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productTwo]);

            const res = await request(app).patch(`/v1/products/${productOne.id}`)
                .send({
                    quantityInStock: productTwo.quantityInStock
                })
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test(' should return bad request error if no field in body request', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).patch(`/v1/products/${productOne.id}`)
                .send()
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test(' should return unauthorized error if token is invalid or bearer token is empty', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).patch(`/v1/products/${productOne.id}`)
                .send({
                    quantityInStock: productTwo.quantityInStock
                })
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });

    describe('DELETE /v1/products/:productId', () => {
        test('should return 200 if productId id exist, valid and token is valid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).delete(`/v1/products/${productOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.OK);
        });

        test('should return not found error if product not exist', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productTwo]);

            const res = await request(app).delete(`/v1/products/${productOne.id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.NOT_FOUND);
        });

        test('should return bad request error if productId is invalid', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productTwo]);

            const res = await request(app).delete(`/v1/products/invalidId`)
                .set('Authorization', `Bearer ${userOneAccessToken}`);

            expect(res.statusCode).toBe(status.BAD_REQUEST);
        });

        test('should return unauthorized error if token is invalid or bearer token is empty', async () => {
            await insertUsers([userOne, userTwo]);
            await insertCategory([categoryOne, categoryTwo]);
            await insertProduct([productOne, productTwo]);

            const res = await request(app).delete(`/v1/products/${productOne.id}`)
                .set('Authorization', `Bearer invalidToken`);

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });
});