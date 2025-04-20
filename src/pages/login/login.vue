<template>
  <view class="login-container">
    <!-- 大众点评LOGO和slogan -->
    <view class="logo-section">
      <image
        class="logo"
        src="https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp"
        mode="aspectFit"
      ></image>
      <view class="slogan">
        <text class="slogan-item">发</text>
        <text class="slogan-item">现</text>
        <text class="slogan-item">好</text>
        <text class="slogan-item">去</text>
        <text class="slogan-item">处</text>
      </view>
    </view>
    <!-- 调试获取的用户昵称 -->
    <view>
      <text>用户昵称：{{ nickName || '暂无' }}</text>
    </view>

    <!-- 登录按钮区域 -->
    <view class="login-buttons">
      <!-- 一键登录按钮 -->
      <button class="btn btn-primary" @click="handleOneKeyLogin">
        手机号一键登录
      </button>

      <!-- 手机号登录按钮 -->
      <button class="btn btn-secondary" @click="handlePhoneLogin">
        输入手机号码登录/注册
      </button>
    </view>

    <!-- 用户协议区域 -->
    <view class="agreement">
      <view class="checkbox" @click="toggleAgreement">
        <view
          v-if="isAgreed"
          class="iconfont icon-xuanzhong"
          style="color: #f76c3f; font-size: 18px"
        ></view>
        <view
          v-else
          class="iconfont icon-danxuan_weixuanzhong"
          style="color: #ddd; font-size: 18px"
        ></view>
      </view>
      <view class="agreement-text">
        <text>我已阅读并同意</text>
        <text class="link" @click="handleUserAgreement"
          >《美团用户服务协议》</text
        >
        <text>和</text>
        <text class="link" @click="handlePrivacyPolicy">隐私政策</text>
      </view>
    </view>

    <!-- 协议未勾选提示 -->
    <view v-if="showAgreementTip" class="agreement-tip">
      <text>请先阅读并勾选用户协议</text>
      <view class="close-icon" @click="closeAgreementTip">
        <text>×</text>
      </view>
    </view>

    <!-- 微信手机号验证弹窗 -->
    <view
      v-if="showWxPhonePopup"
      class="wx-phone-popup"
      @click.self="closeWxPhonePopup"
    >
      <view
        class="wx-phone-content"
        :class="{ 'popup-show': showWxPhonePopup }"
      >
        <!-- 头部信息 -->
        <view class="wx-popup-header">
          <view class="wx-popup-logo">
            <view
              class="iconfont icon-dianping"
              style="color: #fff; font-size: 40rpx"
            ></view>
          </view>
          <view class="wx-popup-title">大众点评美食电影运动旅游门票</view>
          <view class="wx-popup-info">
            <view
              class="iconfont icon-info"
              style="color: #fff; font-size: 40rpx"
            ></view>
          </view>
        </view>

        <!-- 提示文本 -->
        <view class="wx-popup-tips">
          <view class="wx-popup-main-tip">申请获取并验证你的手机号</view>
          <view class="wx-popup-sub-tip">用于注册创建账号和登录</view>
        </view>

        <!-- 手机号 -->
        <view class="wx-popup-phone">
          <text>193****0805</text>
          <view class="wx-popup-phone-desc">微信绑定号码</view>
        </view>

        <!-- 按钮 -->
        <button class="wx-popup-btn" @click="handleDisallowPhone">
          不允许
        </button>

        <!-- 底部链接 -->
        <view class="wx-popup-footer">
          <text @click="handleUseOtherPhone">使用其它号码</text>
        </view>
      </view>
    </view>
    <view>
      <button @click="getUseFileFunction">调用wx.login方法</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

// 是否同意协议
const isAgreed = ref(false);
// 是否显示协议提示
const showAgreementTip = ref(false);
// 是否显示微信手机号弹窗
const showWxPhonePopup = ref(false);
// 用户信息
const nickName = ref('');

const getUseFileFunction = () => {
  uni.showModal({
    title: "提示",
    content: "这是一个模态弹窗",
    success: function (res) {
      if (res.confirm) {
        console.log("用户点击确定");
        uni.getUserProfile({
          desc: "授权登录",
          success: (userInfo) => {
            console.log("用户信息：", userInfo);
            
            nickName.value = userInfo.userInfo.nickName
            uni.login({
              success: (res) => {
                console.log("登录成功：", res);
                uni.request({
                  url: "https://api.weixin.qq.com/sns/jscode2session",
                  data: {
                    appid: "wxcbccf8cb6ce46d3c",
                    secret: "12c4f0d28c758d608c76527a0408ba47",
                    js_code: res.code, // wx.login登录code
                    grant_type: "authorization_code", // 固定赋值
                  },
                  success: (res) => {
                    console.log("请求成功：", res);
                    // openid
                    const openid = res.data.openid
                    console.log("openid：", openid);
                  },
                });
              },
            });
          },
        });
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
};

// 手机号一键登录
const handleOneKeyLogin = () => {
  console.log("点击了手机号一键登录");
  if (!isAgreed.value) {
    showAgreementWarning();
    return;
  }

  // 显示微信手机号验证弹窗
  showWxPhonePopup.value = true;
};

// 手机号登录/注册
const handlePhoneLogin = () => {
  console.log("点击了手机号登录/注册");
  if (!isAgreed.value) {
    showAgreementWarning();
    return;
  }
  // 跳转到手机号登录页面
  uni.navigateTo({
    url: "/pages/login/phoneLogin",
  });
};

// 显示协议警告
const showAgreementWarning = () => {
  showAgreementTip.value = true;
  // 3秒后自动关闭提示
  setTimeout(() => {
    showAgreementTip.value = false;
  }, 3000);
};

// 关闭协议提示
const closeAgreementTip = () => {
  showAgreementTip.value = false;
};

// 关闭微信手机号弹窗
const closeWxPhonePopup = () => {
  showWxPhonePopup.value = false;
};

// 处理不允许获取手机号
const handleDisallowPhone = () => {
  console.log("不允许获取手机号");
  closeWxPhonePopup();
};

// 处理使用其它手机号
const handleUseOtherPhone = () => {
  console.log("使用其它手机号");
  closeWxPhonePopup();
  // 跳转到手机号输入页面
  uni.navigateTo({
    url: "/pages/login/phoneLogin",
  });
};

// 切换同意协议状态
const toggleAgreement = () => {
  isAgreed.value = !isAgreed.value;
  console.log("同意协议状态:", isAgreed.value);
};

// 查看用户协议
const handleUserAgreement = () => {
  console.log("查看用户协议");
  // 这里可以实现查看用户协议的逻辑
};

// 查看隐私政策
const handlePrivacyPolicy = () => {
  console.log("查看隐私政策");
  // 这里可以实现查看隐私政策的逻辑
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background-color: #fff;
  padding-top: 50px; // 适配不同机型状态栏高度
  display: flex;
  flex-direction: column;
}

// LOGO区域
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 180rpx;

  .logo {
    width: 320rpx;
    height: 120rpx;
    margin-bottom: 30rpx;
  }

  .slogan {
    display: flex;

    .slogan-item {
      font-size: 38rpx;
      color: #333;
      margin: 0 15rpx;
      font-weight: normal;
    }
  }
}

// 登录按钮区域
.login-buttons {
  padding: 0 60rpx;

  .btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    border-radius: 45rpx;
    font-size: 32rpx;
    margin-bottom: 30rpx;

    &.btn-primary {
      background-color: #f76c3f;
      color: #fff;
      border: none;
    }

    &.btn-secondary {
      background-color: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
  }
}

// 协议区域
.agreement {
  display: flex;
  align-items: center;
  padding: 0 60rpx;
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

// 协议未勾选提示
.agreement-tip {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  z-index: 999;

  .close-icon {
    margin-left: 20rpx;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #fff;
  }
}

// 微信手机号验证弹窗
.wx-phone-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  .wx-phone-content {
    width: 100%;
    background-color: #222222;
    border-radius: 20rpx 20rpx 0 0;
    padding: 40rpx 30rpx;
    transform: translateY(100%);
    transition: transform 0.3s ease;

    &.popup-show {
      transform: translateY(0);
    }
  }

  .wx-popup-header {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .wx-popup-logo {
      width: 80rpx;
      height: 80rpx;
      background-color: #f76c3f;
      border-radius: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .wx-popup-title {
      flex: 1;
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #fff;
    }

    .wx-popup-info {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .wx-popup-tips {
    margin-bottom: 40rpx;

    .wx-popup-main-tip {
      font-size: 34rpx;
      color: #fff;
      margin-bottom: 10rpx;
    }

    .wx-popup-sub-tip {
      font-size: 28rpx;
      color: #999;
    }
  }

  .wx-popup-phone {
    background-color: #333;
    padding: 40rpx 0;
    border-radius: 16rpx;
    text-align: center;
    margin-bottom: 40rpx;

    text {
      font-size: 36rpx;
      color: #fff;
      font-weight: 500;
    }

    .wx-popup-phone-desc {
      font-size: 24rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }

  .wx-popup-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #333;
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
    margin-bottom: 30rpx;
    border: none;
  }

  .wx-popup-footer {
    text-align: center;
    margin-bottom: 20rpx;

    text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
