const passport = require('passport');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject, roles) => (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
    }

    if (roles.length && !roles.includes(user.role)) {
        return reject(new ApiError(status.UNAUTHORIZED, ' Forbidden: Unauthorized Role'));
    }

    req.user = user;

    resolve();
}

const auth = (roles) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, roles))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
}

module.exports = auth;