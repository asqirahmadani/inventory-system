const { status } = require('http-status');
const { categoryService } = require('../service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);

    res.status(status.CREATED).send({
        status: status.CREATED,
        message: 'Create category success',
        data: category
    });
});

const getCategorys = catchAsync(async (req, res) => {
    const result = await categoryService.queryCategorys(req.query);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get categorys success',
        data: result
    });
});

const getCategoryById = catchAsync(async (req, res) => {
    const result = await categoryService.getCategoryById(req.params.categoryId);
    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'Category not found!');
    }

    res.status(status.OK).send({
        status: status.OK,
        message: 'Get category success',
        data: result
    });
});

const updateCategory = catchAsync(async (req, res) => {
    const result = await categoryService.updateCategoryById(req.params.categoryId, req.body);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Update category success',
        data: result
    });
});

const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategoryById(req.params.categoryId);

    res.status(status.OK).send({
        status: status.OK,
        message: 'Delete category success',
        data: null
    });
});

module.exports = {
    createCategory,
    getCategorys,
    getCategoryById,
    updateCategory,
    deleteCategory
}