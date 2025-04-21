/**
 * 认证相关API服务（本地模拟版）
 */

/**
 * 微信登录（本地模拟版）
 * @param {string} code 微信登录临时凭证
 * @param {string} phoneCode 获取手机号的授权code(可选)
 * @param {object} userInfo 用户信息对象(可选)
 * @returns {Promise} 请求结果Promise
 */
export const wxLogin = (code, phoneCode = null, userInfo = null) => {
  console.log('微信登录（本地模拟）:', { code, phoneCode, userInfo });
  
  // 模拟网络延迟和登录成功
  return new Promise((resolve) => {
    uni.showLoading({
      title: '登录中...',
      mask: true
    });
    
    setTimeout(() => {
      uni.hideLoading();
      
      // 模拟登录成功响应
      resolve({
        code: 0,
        message: "登录成功",
        data: {
          token: "mock_token_" + Date.now(),
          expiresIn: 2592000,
          userInfo: {
            userId: "user_" + Date.now().toString().substring(5),
            openid: "openid_" + (code || "").substring(0, 6),
            nickName: userInfo?.nickName || "微信用户",
            avatarUrl: userInfo?.avatarUrl || "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIb1K2tgdVHiaXFpkn8Vl0GXQM8PrKXLxZH1kRo06AOHLYSPiaHa5l7BxdhHnVR4lDvMF4FrXEc7gg/132",
            gender: userInfo?.gender || 0,
            phone: phoneCode ? "138****" + Date.now().toString().substring(6, 10) : null,
            isPhoneVerified: !!phoneCode
          },
          isNewUser: false
        }
      });
    }, 1000);
  });
};

/**
 * 退出登录（本地模拟版）
 * @returns {Promise} 请求结果Promise
 */
export const logout = () => {
  console.log('退出登录（本地模拟）');
  
  return new Promise((resolve) => {
    // 清除本地存储的登录信息
    clearLoginInfo();
    
    // 模拟网络延迟
    setTimeout(() => {
      resolve({
        code: 0,
        message: "退出成功"
      });
    }, 500);
  });
};

/**
 * 保存登录信息
 * @param {object} loginData 登录接口返回的数据
 */
export const saveLoginInfo = (loginData) => {
  // 保存token
  uni.setStorageSync('token', loginData.token);
  // 保存用户信息
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
 * @returns {object|null} 用户信息对象或null
 */
export const getUserInfo = () => {
  return uni.getStorageSync('userInfo') || null;
};

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  return !!uni.getStorageSync('token');
};

export default {
  wxLogin,
  logout,
  saveLoginInfo,
  clearLoginInfo,
  getUserInfo,
  isLoggedIn
}; 