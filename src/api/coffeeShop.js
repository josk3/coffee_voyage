/**
 * 咖啡店相关API服务
 */
import request from '@/utils/request';

/**
 * 获取咖啡店列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getCoffeeShops = (params) => {
  return request.get('/coffee-shops', params);
};

/**
 * 获取咖啡店详情
 * @param {String} id - 咖啡店ID
 * @returns {Promise}
 */
export const getCoffeeShop = (id) => {
  return request.get(`/coffee-shops/${id}`);
};

/**
 * 获取咖啡店评论
 * @param {String} shopId - 咖啡店ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getCoffeeShopReviews = (shopId, params) => {
  return request.get(`/coffee-shops/${shopId}/reviews`, params);
};

/**
 * 添加咖啡店评论
 * @param {String} shopId - 咖啡店ID
 * @param {Object} data - 评论数据
 * @returns {Promise}
 */
export const addCoffeeShopReview = (shopId, data) => {
  return request.post(`/coffee-shops/${shopId}/reviews`, data);
};

export default {
  getCoffeeShops,
  getCoffeeShop,
  getCoffeeShopReviews,
  addCoffeeShopReview
}; 