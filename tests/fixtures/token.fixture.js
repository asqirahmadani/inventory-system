const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/token');
const tokenService = require('../../src/service/token.service');
const { userOne, admin } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne.id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin.id, accessTokenExpires, tokenTypes.ACCESS);

module.exports = {
    userOneAccessToken,
    adminAccessToken,
};