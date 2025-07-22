const express = require('express');
const router = express.Router();

const v1route = require('./v1/index');

router.use('/v1', v1route);

module.exports = router;