const app = require('./app');
const prisma = require('../prisma');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

if (prisma) {
  logger.info('Connected to Database');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (err) => {
  logger.error(err);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
