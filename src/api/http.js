/**
 * HTTP请求工具模块 (本地模拟版)
 */

// 基础URL (本地模拟)
const BASE_URL = '/mock-api';

// 通用请求方法
export const request = (url, method, data, needToken = true) => {
  return new Promise((resolve, reject) => {
    console.log(`[模拟请求] ${method} ${url}`, {
      url: `${BASE_URL}${url}`,
      method,
      data,
      needToken
    });
    
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟成功响应
      resolve({
        code: 0,
        message: '操作成功',
        data: {
          // 随机模拟数据
          id: Date.now(),
          timestamp: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// 封装GET请求
export const get = (url, data = {}, needToken = true) => {
  return request(url, 'GET', data, needToken);
};

// 封装POST请求
export const post = (url, data = {}, needToken = true) => {
  return request(url, 'POST', data, needToken);
};

// 导出BASE_URL常量
export const getBaseUrl = () => BASE_URL;

export default {
  request,
  get,
  post,
  getBaseUrl
}; 