const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const paginate = require('../utils/paginate');


/**
 * Create a category
 * @param {Object} categoryBody 
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
    return prisma.category.create({
        data: categoryBody
    });
}

/**
 * Query for categorys
 * @returns {Promise<QueryResult>}
 */
const queryCategorys = async (filter) => {
    const page = parseInt(filter.page);
    const limit = parseInt(filter.limit);

    const result = await paginate({
        model: prisma.category,
        page: page,
        limit: limit
    });

    return result;
}

/**
 * Get category by id
 * @param {ObjectId} id 
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
    return prisma.category.findFirst({
        where: {
            id: id
        }
    });
}

/**
 * Update category by id
 * @param {ObjectId} categoryId 
 * @param {Object} updateBody 
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
    const category = await getCategoryById(categoryId);
    if (!category) {
        throw new ApiError(status.NOT_FOUND, 'Category not found');
    }

    const updateCategory = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: updateBody
    });

    return updateCategory;
}

/**
 * 
 * @param {ObjectId} categoryId 
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
    const category = await getCategoryById(categoryId);
    if (!category) {
        throw new ApiError(status.NOT_FOUND, 'Category not found');
    }

    const deleteCategorys = await prisma.category.deleteMany({
        where: {
            id: categoryId
        }
    });

    return deleteCategorys
}

module.exports = {
    createCategory,
    queryCategorys,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}