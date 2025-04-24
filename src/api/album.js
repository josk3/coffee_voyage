/**
 * 专辑相关API服务
 */
import request from '@/utils/request';

/**
 * 获取推荐专辑
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getFeaturedAlbums = (params) => {
  return request.get('/albums/featured', params);
};

/**
 * 获取专辑详情
 * @param {String} id - 专辑ID
 * @returns {Promise}
 */
export const getAlbum = (id) => {
  return request.get(`/albums/${id}`);
};

/**
 * 获取专辑下的课程
 * @param {String} id - 专辑ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getAlbumCourses = (id, params) => {
  return request.get(`/albums/${id}/courses`, params);
};

export default {
  getFeaturedAlbums,
  getAlbum,
  getAlbumCourses
}; 