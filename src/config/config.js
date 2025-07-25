const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
        url: process.env.DATABASE_URL
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES) || 30,
        refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS) || 30,
    },
}