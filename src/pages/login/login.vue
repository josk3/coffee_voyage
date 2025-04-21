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
      <view class="userInfo_tank" :class="userInfo_tank ? 'transfromjoin' : 'transfromout'" :style="{ backgroundColor: isDarkMode ? '#222' : '#fff' }">
        <!-- 弹窗标题区带应用信息 -->
        <view class="tank_header">
          <view class="app_icon">
            <image src="/static/logo.png" mode="aspectFit"></image>
          </view>
          <view class="app_info">
            <text class="app_name">博古斯美食教室 申请</text>
          </view>
        </view>

        <view class="tank_title">
          <text>你的昵称、头像</text>
        </view>

        <!-- 预览区域 -->
        <view class="preview_area" :style="{ backgroundColor: isDarkMode ? '#333' : '#f8f8f8' }">
          <view class="preview_user">
            <!-- 头像选择按钮 -->
            <button class="avatar_button preview_avatar_btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image 
                class="preview_avatar" 
                :src="avatarUrl || '/static/default-avatar.png'" 
                mode="aspectFill">
              </image>
              <!-- 添加相机图标提示可点击 -->
              <view class="camera_icon">
                <text class="iconfont icon-camera">📷</text>
              </view>
            </button>
            <view class="preview_info">
              <text class="preview_nickname">{{ nickName || '半糖士豆腐咖啡_' }}</text>
              <text class="preview_source">微信昵称头像</text>
            </view>
          </view>
          <view class="preview_check">
            <text class="check_icon">✓</text>
          </view>
        </view>

        <view class="other_option_hint">
          <text @click="useOtherAvatarNickname">使用其他昵称</text>
        </view>
        
        <view class="tank_content" v-if="showCustomInput">
          <text>昵称：</text>
          <input form-type='submit' @blur="getNickName" placeholder="请输入昵称" type="nickname" />
        </view>
        
        <view class="confirm_button">
          <view>
            <button @click="closeTank" :style="{ color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#ddd' }">取消</button>
          </view>
          <view>
            <button @click="submit" type="primary" :style="{ backgroundColor: '#07c160' }">允许</button>
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
      userInfo_tank: false,
      isDarkMode: false,
      showCustomInput: false
    }
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  onLoad() {
    // 检测系统是否为暗黑模式
    this.checkDarkMode();
  },
  methods: {
    // 检测系统暗黑模式
    checkDarkMode() {
      // #ifdef APP-PLUS || MP-WEIXIN
      uni.getSystemInfo({
        success: (res) => {
          this.isDarkMode = res.theme === 'dark';
          console.log('当前系统主题:', res.theme);
        }
      });
      // #endif
    },
    
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
      
      // 延迟跳转到首页
      setTimeout(() => {
        // 获取当前页面栈
        const pages = getCurrentPages();
        if (pages.length > 1) {
          // 如果有上一页，则返回上一页
          uni.navigateBack({
            delta: 1
          });
        } else {
          // 如果没有上一页，则跳转到首页
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
    },

    useOtherAvatarNickname() {
      this.showCustomInput = !this.showCustomInput;
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
  height: 100vh;
  background-color: #ffffff;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;
  margin-top: 100rpx;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  width: 90%;
  height: 90rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-bottom: 30rpx;
}

.btn-primary {
  background-color: #07c160;
  color: #ffffff;
}

.btn-secondary {
  background-color: #f8f8f8;
  color: #333333;
  border: 1px solid #dddddd;
}

.agreement {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.agreement-text {
  font-size: 26rpx;
  color: #999999;
  margin-left: 10rpx;
}

.link {
  color: #576b95;
}

/* 授权弹窗样式 */
.userInfo_tank_bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background: #000;
  z-index: 666;
}

.userInfo_tank {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  width: 100%;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx;
  box-sizing: border-box;
  z-index: 999;
  transform: translateY(100%);
}

.transfromjoin {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.transfromout {
  transition: all 0.3s ease;
  transform: translateY(100%);
}

.avatar_url {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.tank_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  height: 100rpx;
}

.tank_content text {
  color: #787376;
}

.tank_content input {
  width: 80%;
  text-align: right;
}

.tank_title {
  border-bottom: 1px solid #eee;
  padding: 20rpx 10rpx;
  font-weight: 600;
}

.confirm_button {
  display: flex;
  margin: 50rpx 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}

.confirm_button view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.confirm_button view button {
  width: 90%;
  border-radius: 10rpx;
  font-size: 30rpx;
}

.avatar_button {
  padding: 0 !important;
  margin: 0 !important;
  width: 80rpx !important;
  height: 80rpx !important;
  border-radius: 50% !important;
  font-size: 32rpx !important;
  overflow: visible !important;
}

.tank_header {
  display: flex;
  align-items: center;
  padding: 20rpx 10rpx;
  margin-bottom: 10rpx;
}

.app_icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.app_icon image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.app_info {
  flex: 1;
}

.app_name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.preview_area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 10rpx;
  margin: 20rpx 0;
  background-color: #f8f8f8;
  border-radius: 10rpx;
}

.preview_user {
  display: flex;
  align-items: center;
}

.preview_avatar_btn {
  position: relative;
  width: 80rpx !important;
  height: 80rpx !important;
  margin-right: 20rpx !important;
  border-radius: 50% !important;
  padding: 0 !important;
  background: none !important;
}

.preview_avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.preview_info {
  display: flex;
  flex-direction: column;
}

.preview_nickname {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 5rpx;
}

.preview_source {
  font-size: 24rpx;
  color: #999999;
}

.preview_check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #07c160;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check_icon {
  font-size: 24rpx;
  color: #ffffff;
}

.other_option_hint {
  padding: 20rpx 10rpx;
  text-align: left;
  font-size: 26rpx;
  color: #576b95;
  margin-bottom: 10rpx;
}

.camera_icon {
  position: absolute;
  right: -5rpx;
  bottom: -5rpx;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
}

.iconfont {
  font-size: 18rpx;
  color: #666;
}

.icon-camera {
  font-size: 18rpx;
  color: #666;
}
</style>
