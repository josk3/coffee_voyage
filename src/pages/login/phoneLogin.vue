<template>
  <view class="phone-login-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-icon" @click="handleBack">
        <view class="iconfont icon-fanhui"></view>
      </view>
      <text class="title">登录</text>
      <view class="right-icons">
        <view class="icon-more" @click="handleMore">
          <text class="iconfont icon-more"></text>
        </view>
        <view class="icon-target" @click="handleTarget">
          <text class="iconfont icon-circle"></text>
        </view>
      </view>
    </view>
    
    <!-- 主标题 -->
    <view class="main-title">
      <text>手机号登录/注册</text>
    </view>
    
    <!-- 手机号输入区域 -->
    <view class="phone-input-area">
      <!-- 国家区号选择 -->
      <view class="country-code" @click="selectCountryCode">
        <text>中国+86</text>
        <view class="arrow-down"></view>
      </view>
      
      <!-- 手机号输入框 -->
      <view class="phone-input-wrapper">
        <input 
          type="number" 
          class="phone-input" 
          placeholder="请输入手机号" 
          v-model="phoneNumber"
          @input="handlePhoneInput"
        />
        <view v-if="phoneNumber" class="clear-btn" @click="clearPhoneNumber">
          <text class="iconfont icon-close"></text>
        </view>
      </view>
    </view>
    
    <!-- 验证码输入区域 -->
    <view class="verification-area">
      <input 
        type="number" 
        class="verification-input" 
        placeholder="请输入验证码" 
        v-model="verificationCode"
      />
      <button 
        class="get-code-btn" 
        :disabled="isCodeButtonDisabled" 
        :class="{ 'btn-disabled': isCodeButtonDisabled }"
        @click="getVerificationCode"
      >
        {{ codeButtonText }}
      </button>
    </view>
    
    <!-- 提示信息 -->
    <view class="tip-text">
      <text>未注册的手机号码验证后自动注册</text>
    </view>
    
    <!-- 登录按钮 -->
    <button 
      class="login-btn" 
      :class="{ 'login-btn-active': isLoginActive }" 
      @click="handleLogin"
    >
      登录
    </button>
    
    <!-- 协议区域 -->
    <view class="agreement">
      <view class="checkbox" @click="toggleAgreement">
        <view v-if="isAgreed" class="iconfont icon-xuanzhong" style="color: #f76c3f; font-size: 18px;"></view>
        <view v-else class="iconfont icon-danxuan_weixuanzhong" style="color: #ddd; font-size: 18px;"></view>
      </view>
      <view class="agreement-text">
        <text>我已阅读并同意</text>
        <text class="link" @click="handleUserAgreement">《美团用户服务协议》</text>
        <text>和</text>
        <text class="link" @click="handlePrivacyPolicy">隐私政策</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

// 手机号
const phoneNumber = ref('');
// 验证码
const verificationCode = ref('');
// 是否同意协议
const isAgreed = ref(true);
// 获取验证码按钮文本
const codeButtonText = ref('获取验证码');
// 是否禁用获取验证码按钮
const isCodeButtonDisabled = ref(false);
// 倒计时秒数
const countdown = ref(60);

// 手机号校验规则
const phoneRules = [
  { required: true, message: '请输入手机号码' },
  { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '手机号码格式不正确，请重新输入' }
];

// 登录按钮是否激活
const isLoginActive = computed(() => {
  return phoneNumber.value.length === 11 && verificationCode.value.length >= 4;
});

// 验证手机号
const validatePhone = () => {
  if (!phoneNumber.value) {
    uni.showToast({
      title: phoneRules[0].message,
      icon: 'none'
    });
    return false;
  }
  
  if (!phoneRules[1].pattern.test(phoneNumber.value)) {
    uni.showToast({
      title: phoneRules[1].message,
      icon: 'none'
    });
    return false;
  }
  
  return true;
};

// 返回上一页
const handleBack = () => {
  console.log('返回上一页');
  try {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      // 如果没有上一页，直接跳转到"我的"页面
      uni.switchTab({
        url: '/pages/mine/mine'
      });
    }
  } catch (error) {
    console.error('返回出错:', error);
    // 出错时直接跳转到"我的"页面
    uni.switchTab({
      url: '/pages/mine/mine'
    });
  }
};

// 更多按钮点击
const handleMore = () => {
  console.log('点击了更多按钮');
};

// 目标按钮点击
const handleTarget = () => {
  console.log('点击了目标按钮');
};

// 选择国家区号
const selectCountryCode = () => {
  console.log('选择国家区号');
};

// 处理手机号输入
const handlePhoneInput = (e) => {
  console.log('手机号输入', e.detail.value);
};

// 清除手机号
const clearPhoneNumber = () => {
  phoneNumber.value = '';
};

// 开始倒计时
const startCountdown = () => {
  isCodeButtonDisabled.value = true;
  countdown.value = 60;
  codeButtonText.value = `${countdown.value}秒后重试`;
  
  const timer = setInterval(() => {
    countdown.value--;
    codeButtonText.value = `${countdown.value}秒后重试`;
    
    if (countdown.value <= 0) {
      clearInterval(timer);
      isCodeButtonDisabled.value = false;
      codeButtonText.value = '获取验证码';
    }
  }, 1000);
};

// 获取验证码
const getVerificationCode = () => {
  console.log('获取验证码');
  
  // 校验手机号
  if (!validatePhone()) {
    return;
  }
  
  // 模拟发送验证码
  uni.showToast({
    title: '验证码已发送',
    icon: 'none'
  });
  
  // 开始倒计时
  startCountdown();
};

// 处理登录
const handleLogin = () => {
  console.log('登录');
  
  // 校验手机号
  if (!validatePhone()) {
    return;
  }
  
  if (!verificationCode.value) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    });
    return;
  }
  
  if (verificationCode.value.length < 4) {
    uni.showToast({
      title: '验证码格式不正确',
      icon: 'none'
    });
    return;
  }
  
  if (!isAgreed.value) {
    uni.showToast({
      title: '请阅读并同意用户协议',
      icon: 'none'
    });
    return;
  }
  
  uni.showToast({
    title: '登录成功',
    icon: 'success'
  });
  
  // 登录成功后返回到我的页面
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/mine/mine'
    });
  }, 1500);
};

// 切换同意协议状态
const toggleAgreement = () => {
  isAgreed.value = !isAgreed.value;
  console.log('同意协议状态:', isAgreed.value);
};

// 查看用户协议
const handleUserAgreement = () => {
  console.log('查看用户协议');
};

// 查看隐私政策
const handlePrivacyPolicy = () => {
  console.log('查看隐私政策');
};
</script>

<style lang="scss">
.phone-login-container {
  min-height: 100vh;
  background-color: #fff;
  padding-top: 50px; // 适配不同机型状态栏高度
  padding: 0 30rpx;
}

// 顶部导航栏
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  position: relative;
  
  .back-icon {
    position: absolute;
    left: 0;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
  }
  
  .right-icons {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    
    .icon-more {
      margin-right: 15px;
      display: flex;
      align-items: center;
    }
    
    .icon-target {
      display: flex;
      align-items: center;
    }
  }
}

// 主标题
.main-title {
  margin-top: 60rpx;
  margin-bottom: 60rpx;
  
  text {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
  }
}

// 手机号输入区域
.phone-input-area {
  border-bottom: 1px solid #eee;
  display: flex;
  padding-bottom: 20rpx;
  margin-bottom: 40rpx;
  
  .country-code {
    display: flex;
    align-items: center;
    margin-right: 20rpx;
    padding-right: 20rpx;
    border-right: 1px solid #eee;
    
    text {
      font-size: 32rpx;
      color: #333;
    }
    
    .arrow-down {
      width: 0;
      height: 0;
      border-left: 10rpx solid transparent;
      border-right: 10rpx solid transparent;
      border-top: 10rpx solid #999;
      margin-left: 10rpx;
    }
  }
  
  .phone-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    
    .phone-input {
      flex: 1;
      height: 80rpx;
      font-size: 32rpx;
    }
    
    .clear-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 32rpx;
        color: #999;
      }
    }
  }
}

// 验证码输入区域
.verification-area {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 20rpx;
  margin-bottom: 30rpx;
  
  .verification-input {
    flex: 1;
    height: 80rpx;
    font-size: 32rpx;
  }
  
  .get-code-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #f0f0f0;
    color: #333;
    font-size: 28rpx;
    text-align: center;
    border-radius: 8rpx;
    padding: 0;
    margin: 0;
    border: none;
    
    &.btn-disabled {
      background-color: #f7f7f7;
      color: #999;
    }
  }
}

// 提示信息
.tip-text {
  margin-bottom: 60rpx;
  
  text {
    font-size: 26rpx;
    color: #999;
  }
}

// 登录按钮
.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  border-radius: 45rpx;
  font-size: 32rpx;
  margin-bottom: 40rpx;
  background-color: #ffbda6;
  color: #fff;
  border: none;
  
  &.login-btn-active {
    background-color: #f76c3f;
  }
}

// 协议区域
.agreement {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  
  .checkbox {
    margin-right: 10rpx;
    display: flex;
    align-items: center;
  }
  
  .agreement-text {
    font-size: 24rpx;
    color: #999;
    
    .link {
      color: #1989fa;
    }
  }
}
</style> 