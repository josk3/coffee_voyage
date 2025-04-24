/**
 * 轮播图相关API服务
 */
import request from '@/utils/request';

/**
 * 获取轮播图列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getBanners = (params) => {
  return request.get('/banners', params);
};

export default {
  getBanners
}; 