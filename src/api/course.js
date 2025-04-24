/**
 * 课程相关API服务
 */
import request from '@/utils/request';

/**
 * 获取推荐课程
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getFeaturedCourses = (params) => {
  return request.get('/courses/featured', params);
};

/**
 * 获取课程详情
 * @param {String} id - 课程ID
 * @returns {Promise}
 */
export const getCourse = (id) => {
  return request.get(`/courses/${id}`);
};

/**
 * 搜索课程
 * @param {Object} params - 搜索参数
 * @returns {Promise}
 */
export const searchCourses = (params) => {
  return request.get('/courses/search', params);
};

export default {
  getFeaturedCourses,
  getCourse,
  searchCourses
}; 