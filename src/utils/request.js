/**
 * HTTP请求封装
 */

// API基础URL
const BASE_URL = 'http://localhost:3000/api';

/**
 * 请求函数封装
 * @param {Object} options - 请求配置
 * @returns {Promise} - 返回Promise对象
 */
const request = (options) => {
  // 构建完整URL
  const url = /^(http|https):\/\//.test(options.url) 
    ? options.url 
    : BASE_URL + options.url;
  
  // 默认请求头
  const header = {
    'Content-Type': 'application/json',
    ...options.header
  };
  
  // 从本地存储获取token并添加到请求头
  const token = uni.getStorageSync('token');
  if (token) {
    header.Authorization = `Bearer ${token}`;
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      header,
      success: (res) => {
        // 特殊情况处理：如果返回消息包含"成功"关键词，视为成功响应
        if (res.data && typeof res.data === 'object' && res.data.message && res.data.message.includes('成功')) {
          console.log('检测到成功消息:', res.data.message);
          resolve(res.data);
          return;
        }
        
        // 根据状态码处理响应
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token过期或未授权，跳转到登录页
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          });
          
          // 清除本地存储的token
          uni.removeStorageSync('token');
          
          // 跳转到登录页
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/index'
            });
          }, 1000);
          
          reject(res);
        } else {
          // 其他错误情况
          const errorMsg = res.data && res.data.message ? res.data.message : '请求失败';
          
          // 检查错误消息是否包含"成功"关键词
          if (errorMsg.includes('成功')) {
            console.log('错误响应中包含成功信息，视为成功:', errorMsg);
            resolve(res.data);
            return;
          }
          
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
          reject(res);
        }
      },
      fail: (err) => {
        // 网络错误等
        uni.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      }
    });
  });
};

/**
 * GET请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 */
const get = (url, data = {}, header = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    header
  });
};

/**
 * POST请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 */
const post = (url, data = {}, header = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    header
  });
};

/**
 * PUT请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 */
const put = (url, data = {}, header = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    header
  });
};

/**
 * DELETE请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} header - 请求头
 */
const del = (url, data = {}, header = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    header
  });
};

export default {
  request,
  get,
  post,
  put,
  delete: del
}; 