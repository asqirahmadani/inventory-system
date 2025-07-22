const prisma = require('../../prisma');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const paginate = require('../utils/paginate');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);
  const exist = await prisma.user.findUnique({
    where: { email: userBody.email }
  });
  if (exist) throw new ApiError(status.BAD_REQUEST);

  return prisma.user.create({
    data: userBody
  });
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
}

/**
 * Get all users 
 * @filter {Object} filter
 * @returns {Promise<QueryResult>}
 */
const queryUser = async (filter) => {
  const page = parseInt(filter.page);
  const limit = parseInt(filter.limit);

  const result = await paginate({
    model: prisma.user,
    page: page,
    limit: limit
  });

  return result;
}

/**
 * Get user by id
 * @param {ObjectId} userId 
 * @returns {Promise<user>}
 */
const getUserById = async (userId) => {
  return prisma.user.findFirst({
    where: {
      id: userId
    }
  });
}

/**
 * 
 * @param {String} email 
 * @param {String} newPassword 
 * @returns {Promise<user>}
 */
const updatePassword = async (email, newPassword) => {
  const updateUser = await prisma.user.update({
    where: {
      email
    },
    data: {
      password: newPassword
    }
  });
  return updateUser;
}

/**
 * Update user
 * @param {ObjectId} userId 
 * @param {Object} updateBody 
 * @returns {Promise<user>}
 */
const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  if (updateBody.password) {
    updateBody.password = bcrypt.hashSync(updateBody.password, 8)
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: updateBody
  })
  return updatedUser;
}

/**
 * Delete user
 * @param {ObjectId} userId 
 * @returns {promise<user>}
 */
const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  const deletedUser = await prisma.user.deleteMany({
    where: {
      id: userId
    }
  });

  return deletedUser;
}

/**
 * Get product by user
 * @param {ObjectId} userId 
 * @returns {promise<user>}
 */
const getProductByUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { Product: true }
  });

  return user;
}

/**
 * 
 * @param {ObjectId} userId 
 * @returns {Promise<user>}
 */
const getOrdersByUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { orders: true }
  });

  return user;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  queryUser,
  updatePassword,
  getProductByUser,
  getOrdersByUser
}