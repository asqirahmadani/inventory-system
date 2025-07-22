const { status } = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { Prisma } = require('@prisma/client');
const { log } = require('winston');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        // if error from axios or http request
        if (error.response) {
            const message = err.response.data.message || err.response.data
            const statusCode = error.response.status

            logger.info("handleAxiosError")
            error = new ApiError(statusCode, message, false, err.stack);

        } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // handling prisma error
            logger.info("handlePrismaError")
            error = handlePrismaClientError(err);

        } else if (err instanceof Prisma.PrismaClientValidationError) {
            // handle validation errors (e.g, invalid input data)
            console.error(':', err.message);
            error = new ApiError(500, `Prisma Validation Error: Invalid Input Data`);

        } else if (err instanceof Prisma.PrismaClientInitializationError) {
            // handle initialization errors (e.g, connection issues)
            error = new ApiError(500, `Prisma Initialization Error: Database Connection Issues`);

        } else {
            // handling global error
            const statusCode = error.statusCode;
            const message = error.message || status[statusCode];
            error = new ApiError(statusCode, message, false, err.stack);
        }
    }
    next(error);
}

const handlePrismaClientError = (err) => {
    switch (err.code) {
        case 'P2002':
            // handling duplicate key errors
            return new ApiError(400, `Duplicate field valie: ${err.meta.target}`, false, err.stack);
        case 'P2014':
            // handling invalid id errors
            return new ApiError(400, `Invalid ID: ${err.meta.target}`, false, err.stack);
        case 'P2003':
            // handling invalid data errors
            return new ApiError(400, `Invalid input data: ${err.meta.target}`, false, err.stack);
        default:
            // handling all other errors
            return new ApiError(500, `Something went wrong: ${err.message}`, false, err.stack);
    }
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = status[status.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    }

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
}

module.exports = {
    errorConverter,
    errorHandler
}