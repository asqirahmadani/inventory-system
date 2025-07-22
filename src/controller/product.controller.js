const { status } = require('http-status');
const { productService } = require('../service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createProduct = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const product = await productService.createProduct(req.body, userId);

    res.status(status.CREATED).send({
        status: status.CREATED,
        message: 'Create product success',
        data: product
    });
});

const getProducts = catchAsync(async (req, res) => {
    const result = await productService.queryProduct(req.query);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get products success',
        data: result
    });
});

const getProductById = catchAsync(async (req, res) => {
    const result = await productService.getProductById(req.params.productId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Product not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get product success',
        data: result
    });
});

const updateProduct = catchAsync(async (req, res) => {
    const result = await productService.updateProduct(req.params.productId, req.body);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Update products success',
        data: result
    });
})

const deleteProduct = catchAsync(async (req, res) => {
    await productService.deleteProduct(req.params.productId);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Delete product success',
        data: null
    });
});

const searchProductbyCategory = catchAsync(async (req, res) => {
    const result = await productService.searchProductbyCategory(req.query.category);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Product not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get product by category success',
        data: result
    });
});

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProductbyCategory
}