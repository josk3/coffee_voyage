<template>
  <view class="login-container">
    <view class="logo-container">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">咖啡心情</text>
    </view>

    <view class="login-form">
      <!-- 微信一键登录按钮 -->
      <button class="btn btn-primary" @click="tank" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '微信一键登录' }}
      </button>

      <!-- 手机号登录按钮 -->
      <button class="btn btn-secondary" @click="goToPhoneLogin">
        手机号登录
      </button>

      <!-- 协议说明 -->
      <view class="agreement">
        <checkbox :checked="agreeProtocol" @click="toggleAgreement"></checkbox>
        <text class="agreement-text">
          登录即表示同意
          <text class="link" @click="viewUserAgreement">《用户协议》</text>
          和
          <text class="link" @click="viewPrivacyPolicy">《隐私政策》</text>
        </text>
      </view>
    </view>
    
    <!-- 授权弹窗 -->
    <view>
      <!-- 根据userInfo_tank为true，使得页面呈现模糊效果，同时为灰色部分添加点击事件tank -->
      <view class="userInfo_tank_bg" v-if="userInfo_tank" @click="tank"></view>
      <!--  -->
      <view class="userInfo_tank" :class="userInfo_tank ? 'transfromjoin' : 'transfromout'">
        <view class="tank_title">
          <text>申请获取您的头像、昵称</text>
        </view>
        <view class="tank_content">
          <text>头像：</text>
          <button class="avatar_button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <image class="avatar_url" :src="avatarUrl || '/static/default-avatar.png'"></image>
          </button>
        </view>
        <view class="tank_content">
          <text>昵称：</text>
          <input form-type='submit' @blur="getNickName" placeholder="请输入昵称" type="nickname" />
        </view>
        <view class="confirm_button">
          <view>
            <button @click="closeTank">拒绝</button>
          </view>
          <view>
            <button @click="submit" type="primary">允许</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores/user';

export default {
  data() {
    return {
      isLoading: false,
      agreeProtocol: true,
      userInfo: null,
      nickName: null,
      avatarUrl: null,
      userInfo_tank: false
    }
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  methods: {
    // 打开或关闭授权弹窗
    tank() {
      if (!this.agreeProtocol) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }
      
      if (!this.userInfo_tank) {
        // 检查是否有已保存的用户信息
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo) {
          console.log("已有用户信息:", userInfo);
          this.userInfo = userInfo;
          
          // 检查是否有token，如果有则直接跳转首页
          const token = uni.getStorageSync('token');
          if (token) {
            uni.switchTab({
              url: '/pages/index/index'
            });
          } else {
            // 模拟直接登录成功
            this.simulateLoginSuccess({
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            });
          }
        } else {
          console.log("未注册，打开授权弹窗");
          this.userInfo_tank = true;
        }
      } else {
        this.userInfo_tank = false;
      }
    },
    
    // 关闭弹窗
    closeTank() {
      this.userInfo_tank = false;
    },
    
    // 获取微信头像
    onChooseAvatar(e) {
      console.log("选择头像:", e);
      this.avatarUrl = e.detail.avatarUrl;
    },
    
    // 获取昵称
    getNickName(e) {
      console.log("输入昵称:", e);
      this.nickName = e.detail.value;
    },
    
    // 提交授权信息
    submit() {
      if (!this.avatarUrl) {
        return uni.showToast({
          title: '请选择头像',
          icon: 'error'
        });
      }
      
      if (!this.nickName) {
        return uni.showToast({
          title: '请输入昵称',
          icon: 'error'
        });
      }
      
      this.userInfo_tank = false;
      this.isLoading = true;
      
      uni.showLoading({
        title: '正在登录',
        mask: true
      });
      
      // 直接使用提交的信息进行模拟登录
      setTimeout(() => {
        this.simulateLoginSuccess({
          nickName: this.nickName,
          avatarUrl: this.avatarUrl
        });
        uni.hideLoading();
      }, 1000);
    },
    
    // 模拟登录成功
    simulateLoginSuccess(userInfo) {
      console.log('模拟登录成功:', userInfo);
      
      // 模拟登录数据
      const userData = {
        token: "mock_token_" + Date.now(),
        expiresIn: 2592000,
        userInfo: {
          userId: "user_" + Date.now().toString().substring(5),
          openid: "openid_" + Date.now().toString().substring(8),
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: 0
        }
      };
      
      // 保存用户信息到本地存储
      uni.setStorageSync('token', userData.token);
      uni.setStorageSync('userInfo', userData.userInfo);
      
      // 通过Pinia保存登录信息
      this.userStore.setLoginInfo(userData);
      
      // 显示成功提示
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 返回上一页或跳转首页
      setTimeout(() => {
        // 判断是否有上一页
        const pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack();
        } else {
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      }, 1500);
      
      this.isLoading = false;
    },
    
    goToPhoneLogin() {
      if (!this.agreeProtocol) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: '/pages/login/phoneLogin'
      });
    },
    
    toggleAgreement() {
      this.agreeProtocol = !this.agreeProtocol;
    },
    
    viewUserAgreement() {
      uni.showToast({
        title: '正在加载用户协议...',
        icon: 'none'
      });
    },
    
    viewPrivacyPolicy() {
      uni.showToast({
        title: '正在加载隐私政策...',
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  padding-top: calc(40rpx + var(--status-bar-height));
}

.logo-container {
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.login-form {
  width: 100%;
  margin-top: 100rpx;
}

.btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  border-radius: 45rpx;
  margin-bottom: 30rpx;
  font-size: 32rpx;
}

.btn-primary {
  background-color: #1296db;
  color: #fff;
}

.btn-secondary {
  background-color: #fff;
  color: #1296db;
  border: 1px solid #1296db;
}

.agreement {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  margin-top: 20rpx;
}

.agreement-text {
  margin-left: 10rpx;
  line-height: 1.5;
}

.link {
  color: #1296db;
}

.userInfo_tank_bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.userInfo_tank {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 450rpx;
  background: #fff;
  z-index: 999;
  border-radius: 40rpx 40rpx 0 0;
  padding: 30rpx;
  transform: translateY(100%);
  transition: all 0.3s;
}

.transfromjoin {
  transform: translateY(0);
}

.transfromout {
  transform: translateY(100%);
}

.tank_title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.tank_content {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  text {
    width: 120rpx;
    font-size: 28rpx;
  }
  
  input {
    flex: 1;
    height: 80rpx;
    border: 1px solid #eee;
    border-radius: 10rpx;
    padding: 0 20rpx;
  }
  
  .avatar_button {
    width: 120rpx;
    height: 120rpx;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
  }
  
  .avatar_url {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
  }
}

.confirm_button {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  
  view {
    width: 45%;
    
    button {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
    }
  }
}
</style> 