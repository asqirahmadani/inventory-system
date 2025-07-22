const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken')
const { status } = require('http-status');
const config = require('../../src/config/config');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

describe('Auth routes', () => {
    describe('POST /v1/auth/register', () => {
        test('should return 201 and successfully register user if data is ok', async () => {
            const res = await request(app)
                .post('/v1/auth/register')
                .send({
                    name: userOne.name,
                    email: userOne.email,
                    password: userOne.password
                })

            expect(res.statusCode).toBe(201);
        });

        test('should return 400 error if email is already used', async () => {
            const data = await request(app).post('/v1/auth/register').send({
                name: userOne.name,
                email: userOne.email,
                password: userOne.password
            })

            const res = await request(app)
                .post('/v1/auth/register')
                .send({
                    name: 'coba',
                    email: userOne.email,
                    password: 'Password1',
                });
            expect(res.statusCode).toBe(400);
        });

        test('should return 400 error if email invalid', async () => {
            const res = await request(app).post('/v1/auth/register').send({
                name: userOne.name,
                email: 'lah',
                password: userOne.password
            });
            expect(res.statusCode).toBe(400);
        });

        test('should return 400 error if password length is less than 8 character', async () => {
            const res = await request(app).post('/v1/auth/register').send({
                name: userOne.name,
                email: userOne.email,
                password: 'cui12'
            });
            expect(res.statusCode).toBe(400);
        });

        test('should return 400 error if password does not contain both letters and numbers', async () => {
            const res = await request(app).post('/v1/auth/register').send({
                name: userOne.name,
                email: userOne.email,
                password: 'halahalahalah'
            });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /v1/auth/login', () => {
        test('should return 200 and login user if email and password match', async () => {
            const data = await request(app).post('/v1/auth/register').send({
                name: userOne.name,
                email: userOne.email,
                password: userOne.password
            });

            const res = await request(app).post('/v1/auth/login').send({
                email: userOne.email,
                password: userOne.password
            });

            expect(res.statusCode).toBe(200);
        });

        test('should return 401 error if password is wrong', async () => {
            const data = await request(app).post('/v1/auth/register').send({
                name: userOne.name,
                email: userOne.email,
                password: userOne.password
            });

            const res = await request(app).post('/v1/auth/login').send({
                email: userOne.email,
                password: 'wrongpass123'
            });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('Auth middleware', () => {
        test('should call next with no errors if access token is valid', async () => {
            const data = await insertUsers([admin, userOne]);

            const res = await request(app).get('/v1/users/pagination?page=1&limit=3')
                .set('Authorization', `Bearer ${adminAccessToken}`);
            expect(res.statusCode).toBe(status.OK);
        });

        test('should call next with unauthorized error if access token is not found in header', async () => {
            const res = await request(app).get('/v1/users/pagination?page=1&limit=3');

            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should call next with unauthorized error if access token is not a valid jwt token', async () => {
            const data = await insertUsers([admin, userOne]);

            const res = await request(app).get('/v1/users/pagination?page=1&limit=3')
                .set('Authorization', `Bearer invalidToken`);
            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should call next with unauthorized error if the token is not an access token', async () => {
            const data = await insertUsers([admin, userOne]);

            const login = await request(app).post('/v1/auth/login').send({
                email: userOne.email,
                password: userOne.password
            });

            const res = await request(app).get('/v1/users/pagination?page=1&limit=3')
                .set('Authorization', `Bearer ${login.tokens}`);
            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should call next with unauthorized error if access token is generated with an invalid secret', async () => {
            const data = await insertUsers([admin, userOne]);

            const payload = {
                sub: admin.id,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 60 * 10,
                type: 'access'
            }

            const invalidSecret = 'huhaha';
            const token = jwt.sign(payload, invalidSecret);

            const res = await request(app).get('/v1/users/pagination?page=1&limit=3')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should call next with unauthorized error if access token is expired', async () => {
            const data = await insertUsers([admin, userOne]);

            const payload = {
                sub: admin.id,
                iat: Math.floor(Date.now() / 1000) - 120,
                exp: Math.floor(Date.now() / 1000) - 60,
                type: 'access'
            }

            const expiredToken = jwt.sign(payload, config.jwt.secret);

            const res = await request(app).get('/v1/users/pagination?page=1&limit=3')
                .set('Authorization', `Bearer ${expiredToken}`);
            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });

        test('should call next with unauthorized error if user is not found ', async () => {
            const res = await request(app).get('/v1/users/pagination?page=1&limit=3')
                .set('Authorization', `Bearer ${adminAccessToken}`);
            expect(res.statusCode).toBe(status.UNAUTHORIZED);
        });
    });
});
