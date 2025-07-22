const { status } = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<user>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    const validPassword = await bcrypt.compare(password, user.password);

    if (!user || !validPassword) {
        throw new ApiError(status.NOT_FOUND, 'Incorrect email or password');
    }
    return user;
}

/**
 * 
 * @param {String} refreshToken 
 * @returns {Promise<tokens>}
 */
const logout = async (refreshToken) => {
    return prisma.token.updateMany({
        where: { token: refreshToken },
        data: { blacklisted: true }
    });
}

module.exports = {
    loginUserWithEmailAndPassword,
    logout
}