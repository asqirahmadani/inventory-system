const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../service');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
    const existingUser = await userService.getUserByEmail(req.body.email);

    if (existingUser) {
        throw new ApiError(status.BAD_REQUEST, 'Email already taken');
    }

    const userCreated = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(userCreated);
    res.status(status.CREATED).send({
        status: status.CREATED,
        message: 'Register Success',
        data: { userCreated, tokens }
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(status.OK).send({
        status: status.OK,
        message: 'Login success',
        data: { user, tokens }
    });
});

const logout = catchAsync(async (req, res) => {
    const refreshToken = req.body.refreshToken;
    await authService.logout(refreshToken);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Logout success'
    });
});

module.exports = {
    register,
    login,
    logout
}