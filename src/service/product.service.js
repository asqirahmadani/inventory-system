const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const paginate = require('../utils/paginate');
const { userService, categoryService } = require('./index');

/**
 * Create a product
 * @param {Object} productBody 
 * @param {ObjectId} userId 
 * @returns {Promise<product>}
 */
const createProduct = async (productBody, userId) => {
    const { name, description, price, quantityInStock, categoryId } = productBody;

    const user = await userService.getUserById(userId);
    const category = await categoryService.getCategoryById(categoryId);
    if (!user || !category) {
        throw new ApiError(status.NOT_FOUND, 'User or Category not found');
    }

    return prisma.product.create({
        data: {
            name,
            description,
            price,
            quantityInStock,
            category: {
                connect: { id: categoryId }
            },
            user: {
                connect: { id: userId }
            }
        }
    });
}

/**
 *  Get all products
 * @query {Object} filter
 * @returns {Promise<product>}
 */
const queryProduct = async (filter) => {
    const page = parseInt(filter.page);
    const limit = parseInt(filter.limit);

    const result = await paginate({
        model: prisma.product,
        page: page,
        limit: limit
    });

    return result;
}

/**
 * Get a product by Id
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const getProductById = async (productId) => {
    return prisma.product.findFirst({
        where: {
            id: productId
        }
    });
}

/**
 * Update product by Id
 * @param {Object} productId 
 * @param {ObjectId} updateBody 
 * @returns {Promise<product>}
 */
const updateProduct = async (productId, updateBody) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(status.NOT_FOUND, 'Product not found!');
    }

    const updatedProduct = await prisma.product.update({
        where: {
            id: productId
        },
        data: updateBody
    })

    return updatedProduct;
}

/**
 * Delete a product by Id
 * @param {ObjectId} productId 
 * @returns {Promise<product>}
 */
const deleteProduct = async (productId) => {
    const product = await getProductById(productId);
    if (!product) {
        throw new ApiError(status.NOT_FOUND, 'Product not found!');
    }

    const deletedProduct = await prisma.product.delete({
        where: {
            id: productId
        }
    });

    return deletedProduct;
}

/**
 * Search product by category
 * @param {String} categoryName 
 * @returns {Promise<product>}
 */
const searchProductbyCategory = async (categoryName) => {
    const category = await prisma.category.findFirst({ where: { name: { contains: categoryName } } });
    if (!category) {
        throw new ApiError(status.NOT_FOUND, 'Category not found');
    }

    const result = await prisma.product.findMany({
        where: { categoryId: category.id }
    });

    return result;
}

module.exports = {
    createProduct,
    getProductById,
    queryProduct,
    updateProduct,
    deleteProduct,
    searchProductbyCategory
}