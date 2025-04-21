// stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { auth } from '@/api';

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
  const logout = async () => {
    try {
      // 调用退出登录接口
      await auth.logout();
    } catch (e) {
      console.error('退出登录失败', e);
    } finally {
      // 无论接口是否成功，都清除本地存储的登录信息
      clearUserInfo();
    }
  };
  
  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null;
    token.value = '';
    isLoggedIn.value = false;
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
  };
  
  // 初始化时，自动从本地存储恢复用户信息
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
    clearUserInfo,
    initUserInfo
  };
}); 