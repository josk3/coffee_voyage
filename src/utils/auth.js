/**
 * 认证相关工具函数
 */

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  const token = uni.getStorageSync('token');
  const userInfo = uni.getStorageSync('userInfo');
  return !!token && !!userInfo;
};

/**
 * 跳转到登录页面
 * @param {boolean} replace 是否替换当前页面，默认false
 */
export const navigateToLogin = (replace = false) => {
  if (replace) {
    uni.redirectTo({
      url: '/pages/login/login'
    });
  } else {
    uni.navigateTo({
      url: '/pages/login/login'
    });
  }
};

/**
 * 检查登录状态并跳转（如果未登录）
 * @param {boolean} replace 是否替换当前页面，默认false
 * @returns {boolean} 是否已登录
 */
export const checkLoginAndNavigate = (replace = false) => {
  if (!isLoggedIn()) {
    navigateToLogin(replace);
    return false;
  }
  return true;
};

export default {
  isLoggedIn,
  navigateToLogin,
  checkLoginAndNavigate
}; 