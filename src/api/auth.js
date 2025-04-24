/**
 * 认证相关API服务
 */
import request from '@/utils/request';

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @returns {Promise}
 */
export const register = (data) => {
  return request.post('/auth/register', data);
};

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @returns {Promise}
 */
export const login = (data) => {
  return request.post('/auth/login', data);
};

/**
 * 微信快捷登录
 * @param {Object} data - 微信登录信息
 * @returns {Promise}
 */
export const wxLogin = (data) => {
  return request.post('/auth/wx-login', data);
};

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export const getCurrentUser = () => {
  return request.get('/auth/me');
};

/**
 * 退出登录
 * @returns {Promise}
 */
export const logout = () => {
  return request.post('/auth/logout');
};

/**
 * 保存登录信息
 * @param {Object} loginData - 登录返回数据
 */
export const saveLoginInfo = (loginData) => {
  uni.setStorageSync('token', loginData.token);
  uni.setStorageSync('userInfo', loginData.userInfo);
};

/**
 * 清除登录信息
 */
export const clearLoginInfo = () => {
  uni.removeStorageSync('token');
  uni.removeStorageSync('userInfo');
};

/**
 * 获取用户信息
 * @returns {Object|null}
 */
export const getUserInfo = () => {
  return uni.getStorageSync('userInfo') || null;
};

/**
 * 检查是否已登录
 * @returns {Boolean}
 */
export const isLoggedIn = () => {
  return !!uni.getStorageSync('token');
};

export default {
  register,
  login,
  wxLogin,
  getCurrentUser,
  logout,
  saveLoginInfo,
  clearLoginInfo,
  getUserInfo,
  isLoggedIn
}; 