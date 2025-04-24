/**
 * 用户相关API服务
 */
import request from '@/utils/request';

/**
 * 获取所有用户
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getAllUsers = (params) => {
  return request.get('/users', params);
};

/**
 * 获取单个用户
 * @param {String} id - 用户ID
 * @returns {Promise}
 */
export const getUser = (id) => {
  return request.get(`/users/${id}`);
};

/**
 * 根据openid获取用户
 * @param {String} openid - 微信openid
 * @returns {Promise}
 */
export const getUserByOpenid = (openid) => {
  return request.get(`/users/openid/${openid}`);
};

/**
 * 更新用户信息
 * @param {String} id - 用户ID
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export const updateUser = (id, data) => {
  return request.put(`/users/${id}`, data);
};

/**
 * 删除用户
 * @param {String} id - 用户ID
 * @returns {Promise}
 */
export const deleteUser = (id) => {
  return request.delete(`/users/${id}`);
};

/**
 * 更新当前用户信息
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export const updateProfile = (data) => {
  return request.put('/users/profile', data);
};

export default {
  getAllUsers,
  getUser,
  getUserByOpenid,
  updateUser,
  deleteUser,
  updateProfile
}; 