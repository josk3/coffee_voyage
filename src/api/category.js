/**
 * 分类相关API服务
 */
import request from '@/utils/request';

/**
 * 获取所有分类
 * @returns {Promise}
 */
export const getAllCategories = () => {
  return request.get('/categories');
};

/**
 * 获取推荐分类
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getFeaturedCategories = (params) => {
  return request.get('/categories/featured', params);
};

/**
 * 获取分类详情
 * @param {String} id - 分类ID
 * @returns {Promise}
 */
export const getCategory = (id) => {
  return request.get(`/categories/${id}`);
};

/**
 * 获取分类下的课程
 * @param {String} id - 分类ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getCategoryCourses = (id, params) => {
  return request.get(`/categories/${id}/courses`, params);
};

export default {
  getAllCategories,
  getFeaturedCategories,
  getCategory,
  getCategoryCourses
}; 