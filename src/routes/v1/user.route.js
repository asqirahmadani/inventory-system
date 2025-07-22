const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controller/user.controller');

const router = express.Router();

router
    .route('/')
    .post(auth('admin'), validate(userValidation.createUser), userController.createUser)

router.get('/pagination', auth(['admin']), validate(userValidation.queryUser), userController.getUsers);

router
    .route('/:userId')
    .get(auth('admin'), validate(userValidation.getUser), userController.getUserById)
    .patch(auth('admin'), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth('admin'), validate(userValidation.deleteUser), userController.deleteUser)

router.get('/:userId/products', auth('admin'), validate(userValidation.getUser), userController.getProductByUser);
router.get('/:userId/orders', auth('admin'), validate(userValidation.getUser), userController.getOrdersByUser);

module.exports = router;