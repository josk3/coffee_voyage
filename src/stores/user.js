// stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 用户信息状态
  const userInfo = ref(null);
  const token = ref('');
  const isLoggedIn = ref(false);
  
  // 计算属性
  const nickname = computed(() => userInfo.value?.nickName || '');
  const avatar = computed(() => userInfo.value?.avatarUrl || '');
  
  // 初始化用户信息
  const initUserInfo = () => {
    // 从本地存储获取用户信息和token
    const storedToken = uni.getStorageSync('token');
    const storedUserInfo = uni.getStorageSync('userInfo');
    
    if (storedToken && storedUserInfo) {
      token.value = storedToken;
      // 判断userInfo是否为字符串，如果是则解析JSON
      if (typeof storedUserInfo === 'string') {
        try {
          userInfo.value = JSON.parse(storedUserInfo);
        } catch (e) {
          userInfo.value = storedUserInfo;
        }
      } else {
        userInfo.value = storedUserInfo;
      }
      isLoggedIn.value = true;
    }
  };
  
  // 保存用户信息
  const setUserInfo = (info) => {
    console.log('保存用户信息:', info);
    
    // 确保info是有效对象
    if (typeof info === 'object' && info !== null) {
      // 检查关键字段
      if (!info.nickName && !info.avatarUrl) {
        console.warn('用户信息缺少昵称和头像');
      }
      
      userInfo.value = info;
      // 存储用户信息
      uni.setStorageSync('userInfo', info);
      console.log('用户信息已保存到本地存储');
    } else {
      console.error('无效的用户信息格式');
    }
    
    isLoggedIn.value = true;
  };
  
  // 保存token
  const setToken = (newToken) => {
    token.value = newToken;
    uni.setStorageSync('token', newToken);
  };
  
  // 保存登录信息（token和用户信息）
  const setLoginInfo = (loginData) => {
    console.log('保存登录信息:', loginData);
    
    if (!loginData) {
      console.error('登录数据为空');
      return;
    }
    
    // 检查登录数据结构
    if (!loginData.token) {
      console.warn('登录数据缺少token');
    }
    
    if (!loginData.userInfo) {
      console.warn('登录数据缺少用户信息');
      loginData.userInfo = {}; // 确保userInfo存在
    }
    
    setToken(loginData.token);
    setUserInfo(loginData.userInfo);
    
    console.log('登录信息保存完成，当前状态:', { 
      token: token.value ? '已设置' : '未设置', 
      userInfo: userInfo.value,
      isLoggedIn: isLoggedIn.value
    });
  };
  
  // 退出登录
  const logout = () => {
    // 清除本地存储
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
    // 重置状态
    token.value = '';
    userInfo.value = null;
    isLoggedIn.value = false;
  };
  
  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null;
    token.value = '';
    isLoggedIn.value = false;
    uni.removeStorageSync('userInfo');
    uni.removeStorageSync('token');
  };
  
  // 初始化
  initUserInfo();
  
  return {
    userInfo,
    token,
    isLoggedIn,
    nickname,
    avatar,
    setUserInfo,
    setToken,
    setLoginInfo,
    logout,
    clearUserInfo
  };
}); 