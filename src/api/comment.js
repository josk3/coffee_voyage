/**
 * 评论相关API服务
 */
import request from '@/utils/request';

/**
 * 获取所有评论
 * @returns {Promise}
 */
export const getComments = async () => {
  try {
    const response = await request.get('/comments');
    return response.data;
  } catch (error) {
    console.error('获取评论失败', error);
    throw error;
  }
};

/**
 * 添加评论
 * @param {Object} commentData - 评论数据
 * @returns {Promise}
 */
export const addComment = async (commentData) => {
  try {
    const response = await request.post('/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('添加评论失败', error);
    throw error;
  }
};

export default {
  getComments,
  addComment
}; 