<template>
  <view class="mine-container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">我的</text>
      <view class="header-right">
        <view class="icon more" @click="handleClickMore">
          <text class="dot"></text>
          <text class="dot"></text>
          <text class="dot"></text>
        </view>
        <view class="icon setting" @click="handleClickSetting">
          <view class="circle"></view>
        </view>
      </view>
    </view>
    
    <!-- 未登录状态的用户信息区 -->
    <view class="user-info" @click="handleLogin">
      <!-- 默认头像 -->
      <view class="avatar-container">
        <image class="avatar" src="/static/images/avatar-default.png" mode="aspectFill"></image>
      </view>
      
      <!-- 登录文本区域 -->
      <view class="login-info">
        <view class="login-text">点击登录</view>
        <view class="login-desc">登录更精彩</view>
      </view>
      
      <!-- 个人主页箭头 -->
      <view class="profile-link">
        <text class="profile-text">个人主页</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <!-- 内容分割线 -->
    <view class="divider"></view>
    
    <!-- 我的订单部分 -->
    <view class="order-section">
      <!-- 订单标题 -->
      <view class="section-title">
        <text>我的订单</text>
      </view>
      
      <!-- 订单类型菜单 -->
      <view class="order-menu">
        <!-- 待付款 -->
        <view class="order-item" @click="handleOrderType('pending')">
          <view class="order-icon">
            <view class="icon-wallet"></view>
          </view>
          <text class="order-text">待付款</text>
        </view>
        
        <!-- 可使用 -->
        <view class="order-item" @click="handleOrderType('usable')">
          <view class="order-icon">
            <view class="icon-usable"></view>
          </view>
          <text class="order-text">可使用</text>
        </view>
        
        <!-- 退款/售后 -->
        <view class="order-item" @click="handleOrderType('refund')">
          <view class="order-icon">
            <view class="icon-refund"></view>
          </view>
          <text class="order-text">退款/售后</text>
        </view>
        
        <!-- 全部订单 -->
        <view class="order-item" @click="handleOrderType('all')">
          <view class="order-icon">
            <view class="icon-all-orders"></view>
          </view>
          <text class="order-text">全部订单</text>
        </view>
      </view>
    </view>
    
    <!-- 内容分割线 -->
    <view class="divider"></view>
    
    <!-- 必备工具部分 -->
    <view class="tools-section">
      <!-- 工具标题 -->
      <view class="section-title">
        <text>必备工具</text>
      </view>
      
      <!-- 工具菜单 -->
      <view class="tools-menu">
        <!-- 企业服务 -->
        <view class="tool-item" @click="handleToolType('enterprise')">
          <view class="tool-icon">
            <view class="icon-enterprise"></view>
          </view>
          <text class="tool-text">企业服务</text>
        </view>
        
        <!-- 商家入驻 -->
        <view class="tool-item" @click="handleToolType('merchant')">
          <view class="tool-icon">
            <view class="icon-merchant"></view>
          </view>
          <text class="tool-text">商家入驻</text>
        </view>
        
        <!-- 联系客服 -->
        <view class="tool-item" @click="handleToolType('customer')">
          <view class="tool-icon">
            <view class="icon-customer"></view>
          </view>
          <text class="tool-text">联系客服</text>
        </view>
      </view>
    </view>
    
    <!-- 内容分割线 -->
    <view class="divider"></view>
    
    <!-- 功能列表部分 -->
    <view class="function-list">
      <!-- 待评价 -->
      <view class="function-item" @click="handleFunction('review')">
        <text class="function-text">待评价</text>
        <text class="function-arrow">></text>
      </view>
      
      <!-- 列表项分割线 -->
      <view class="item-divider"></view>
      
      <!-- 收藏 -->
      <view class="function-item" @click="handleFunction('favorite')">
        <text class="function-text">收藏</text>
        <text class="function-arrow">></text>
      </view>
      
      <!-- 列表项分割线 -->
      <view class="item-divider"></view>
      
      <!-- 隐私管理 -->
      <view class="function-item" @click="handleFunction('privacy')">
        <text class="function-text">隐私管理</text>
        <text class="function-arrow">></text>
      </view>
    </view>
    
    <!-- 内容分割线 -->
    <view class="divider"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 点击事件处理函数
const handleClickMore = () => {
  console.log('点击了更多按钮');
};

const handleClickSetting = () => {
  console.log('点击了设置按钮');
};

// 点击登录处理函数
const handleLogin = () => {
  console.log('点击了登录区域，跳转到登录页面');
  uni.navigateTo({
    url: '/pages/login/login'
  });
};

// 订单类型点击事件
const handleOrderType = (type) => {
  console.log('点击了订单类型:', type);
  // 这里可以根据不同类型跳转到相应的订单页面
};

// 工具类型点击事件
const handleToolType = (type) => {
  console.log('点击了工具类型:', type);
  // 这里可以根据不同类型跳转到相应的工具页面
};

// 功能列表点击事件
const handleFunction = (type) => {
  console.log('点击了功能:', type);
  // 这里可以根据不同功能类型跳转到相应的功能页面
};
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 50px; // 适配不同机型状态栏高度
}

// 顶部标题栏
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px 20px;
  
  .title {
    font-size: 38rpx;
    font-weight: 500;
    color: #000;
  }
  
  .header-right {
    position: absolute;
    right: 20px;
    display: flex;
    align-items: center;
    
    .icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      
      &.more {
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 30rpx;
        
        .dot {
          width: 6px;
          height: 6px;
          background-color: #000;
          border-radius: 50%;
          margin: 2px 0;
        }
      }
      
      &.setting {
        .circle {
          width: 44rpx;
          height: 44rpx;
          border: 3px solid #000;
          border-radius: 50%;
        }
      }
    }
  }
}

// 用户信息区
.user-info {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  
  .avatar-container {
    margin-right: 24rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background-color: #f0f0f0;
    }
  }
  
  .login-info {
    flex: 1;
    
    .login-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .login-desc {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .profile-link {
    display: flex;
    align-items: center;
    
    .profile-text {
      font-size: 28rpx;
      color: #999;
    }
    
    .arrow {
      margin-left: 6rpx;
      font-size: 28rpx;
      color: #ccc;
    }
  }
}

// 分割线
.divider {
  height: 10px;
  background-color: #eee;
}

// 订单部分样式
.order-section {
  background-color: #fff;
  padding: 20rpx 0;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    padding: 0 30rpx 20rpx;
  }
  
  .order-menu {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
    
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 25%;
      
      .order-icon {
        width: 50rpx;
        height: 50rpx;
        margin-bottom: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        
        // 待付款图标
        .icon-wallet {
          width: 45rpx;
          height: 40rpx;
          border: 2px solid #333;
          border-radius: 4px;
          position: relative;
          
          &::before {
            content: "";
            position: absolute;
            width: 30rpx;
            height: 15rpx;
            border: 2px solid #333;
            border-bottom: none;
            border-radius: 15rpx 15rpx 0 0;
            top: -10rpx;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        // 可使用图标
        .icon-usable {
          width: 45rpx;
          height: 45rpx;
          border: 2px solid #333;
          border-radius: 4px;
          position: relative;
          
          &::before {
            content: "✓";
            position: absolute;
            font-size: 32rpx;
            top: -8rpx;
            left: 8rpx;
          }
        }
        
        // 退款/售后图标
        .icon-refund {
          width: 45rpx;
          height: 45rpx;
          border-radius: 50%;
          border: 2px solid #333;
          position: relative;
          
          &::before {
            content: "¥";
            position: absolute;
            font-size: 28rpx;
            top: -5rpx;
            left: 12rpx;
          }
        }
        
        // 全部订单图标
        .icon-all-orders {
          width: 45rpx;
          height: 40rpx;
          border: 2px solid #333;
          border-radius: 2px;
          position: relative;
          
          &::before {
            content: "";
            position: absolute;
            width: 30rpx;
            height: 2px;
            background-color: #333;
            top: 10rpx;
            left: 7rpx;
          }
          
          &::after {
            content: "";
            position: absolute;
            width: 30rpx;
            height: 2px;
            background-color: #333;
            top: 20rpx;
            left: 7rpx;
          }
        }
      }
      
      .order-text {
        font-size: 26rpx;
        color: #333;
      }
    }
  }
}

// 工具部分样式
.tools-section {
  background-color: #fff;
  padding: 20rpx 0;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    padding: 0 30rpx 20rpx;
  }
  
  .tools-menu {
    display: flex;
    padding: 20rpx 0;
    
    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 33.33%;
      
      .tool-icon {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        
        // 企业服务图标
        .icon-enterprise {
          width: 50rpx;
          height: 50rpx;
          position: relative;
          
          &::before {
            content: "";
            position: absolute;
            width: 50rpx;
            height: 30rpx;
            border-left: 2px solid #333;
            border-right: 2px solid #333;
            border-top: 2px solid #333;
            top: 0;
            left: 0;
          }
          
          &::after {
            content: "";
            position: absolute;
            width: 30rpx;
            height: 15rpx;
            border-left: 2px solid #333;
            border-right: 2px solid #333;
            border-bottom: 2px solid #333;
            bottom: 0;
            left: 10rpx;
          }
        }
        
        // 商家入驻图标
        .icon-merchant {
          width: 50rpx;
          height: 45rpx;
          border: 2px solid #333;
          border-radius: 6rpx;
          position: relative;
          
          &::before {
            content: "";
            position: absolute;
            width: 25rpx;
            height: 10rpx;
            border: 2px solid #333;
            border-radius: 10rpx 10rpx 0 0;
            border-bottom: none;
            top: -12rpx;
            left: 50%;
            transform: translateX(-50%);
          }
          
          &::after {
            content: "+";
            position: absolute;
            font-size: 28rpx;
            top: 2rpx;
            right: -15rpx;
            font-weight: bold;
          }
        }
        
        // 联系客服图标
        .icon-customer {
          width: 50rpx;
          height: 50rpx;
          border: 2px solid #333;
          border-radius: 50%;
          position: relative;
          
          &::before {
            content: "";
            position: absolute;
            width: 20rpx;
            height: 20rpx;
            border: 2px solid #333;
            border-radius: 50%;
            bottom: -10rpx;
            right: -5rpx;
            transform: rotate(45deg);
            background-color: #fff;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 50%);
          }
        }
      }
      
      .tool-text {
        font-size: 26rpx;
        color: #333;
      }
    }
  }
}

// 功能列表样式
.function-list {
  background-color: #fff;
  
  .function-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    
    .function-text {
      font-size: 30rpx;
      color: #333;
    }
    
    .function-arrow {
      font-size: 30rpx;
      color: #ccc;
    }
  }
  
  .item-divider {
    height: 1px;
    background-color: #eee;
    margin-left: 30rpx;
  }
}
</style> 