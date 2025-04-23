<template>
  <view class="mine-container">
    <!-- 用户信息区域 - 根据登录状态展示不同内容 -->
    <view class="user-info" @click="handleLogin">
      <!-- 默认头像 -->
      <view class="avatar-container">
        <image
          class="avatar"
          :src="avatar"
          mode="aspectFill"
        ></image>
      </view>

      <!-- 登录文本区域 -->
      <view class="login-info">
        <view class="login-text">{{ nickname }}</view>
        <view class="login-desc">登录更精彩</view>
      </view>

      <!-- 个人主页箭头 -->
      <view class="profile-link">
        <text class="profile-text">个人主页</text>
        <view class="iconfont icon-youjiantou"></view>
      </view>
    </view>

    <!-- 我的订单部分 -->
    <view class="order-section">
      <!-- 订单标题和全部订单入口 -->
      <view class="section-header">
        <text class="section-title">我的订单</text>
      </view>

      <!-- 订单类型菜单 -->
      <view class="order-menu">
        <!-- 待付款 -->
        <view class="order-item" @click="handleOrderType('pending')">
          <view class="order-icon">
            <view class="iconfont icon-31daifukuan"></view>
          </view>
          <text class="order-text">待付款</text>
        </view>

        <!-- 待发货 -->
        <view class="order-item" @click="handleOrderType('shipping')">
          <view class="order-icon">
            <view class="iconfont icon-31daifahuo"></view>
          </view>
          <text class="order-text">待发货</text>
        </view>

        <!-- 待收货 -->
        <view class="order-item" @click="handleOrderType('receiving')">
          <view class="order-icon">
            <view class="iconfont icon-31daifahuo"></view>
          </view>
          <text class="order-text">待收货</text>
        </view>

        <!-- 待评价 -->
        <view class="order-item" @click="handleOrderType('review')">
          <view class="order-icon">
            <view class="iconfont icon-31daipingjia"></view>
          </view>
          <text class="order-text">待评价</text>
        </view>
      </view>
    </view>

    <!-- 必备工具部分 -->
    <view class="tools-section">
      <!-- 工具标题 -->
      <view class="section-header">
        <text class="section-title">必备工具</text>
      </view>

      <!-- 工具菜单 -->
      <view class="tools-menu">
        <!-- 企业服务 -->
        <view class="tool-item" @click="handleToolType('enterprise')">
          <view class="tool-icon">
            <view class="iconfont icon-qiyefuwu"></view>
          </view>
          <text class="tool-text">企业服务</text>
        </view>

        <!-- 商家入驻 -->
        <view class="tool-item" @click="handleToolType('merchant')">
          <view class="tool-icon">
            <view class="iconfont icon-shangjiaruzhu"></view>
          </view>
          <text class="tool-text">商家入驻</text>
        </view>

        <!-- 联系客服 -->
        <view class="tool-item" @click="handleToolType('customer')">
          <view class="tool-icon">
            <view class="iconfont icon-dianhua"></view>
          </view>
          <text class="tool-text">联系客服</text>
        </view>
      </view>
    </view>

    <!-- 功能列表部分 -->
    <view class="function-list">
      <!-- 功能标题和全部入口 -->
      <view class="section-header">
        <text class="section-title">常用功能</text>
      </view>

      <!-- 功能项列表 -->
      <view class="functions-menu">
        <!-- 列表项分割线 -->
        <view class="item-divider"></view>

        <!-- 收藏 -->
        <view class="function-item" @click="handleFunction('favorite')">
          <text class="function-text">收藏</text>
          <view class="iconfont icon-youjiantou"></view>
        </view>

        <!-- 列表项分割线 -->
        <view class="item-divider"></view>

        <!-- 隐私管理 -->
        <view class="function-item" @click="handleFunction('privacy')">
          <text class="function-text">隐私管理</text>
          <view class="iconfont icon-youjiantou"></view>
        </view>
        
        <!-- 已登录时显示退出登录选项 -->
        <template v-if="isLoggedIn">
          <view class="item-divider"></view>
          <view class="function-item logout" @click="handleLogout">
            <text class="function-text logout-text">退出登录</text>
            <view class="iconfont icon-youjiantou"></view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from '@/stores/user';

// 使用用户Pinia Store
const userStore = useUserStore();

// 计算属性：是否已登录
const isLoggedIn = computed(() => userStore.isLoggedIn);
// 计算属性：用户昵称
const nickname = computed(() => userStore.nickname || '点击登录');
// 计算属性：用户头像
const avatar = computed(() => userStore.avatar || 'https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp');

// 点击登录处理函数
const handleLogin = () => {
  // 如果已登录，显示用户信息
  if (isLoggedIn.value) {
    console.log("用户已登录，显示用户信息");
    uni.showToast({
      title: '当前已登录',
      icon: 'none'
    });
    return;
  }
  
  // 未登录则跳转到带返回按钮的登录页面
  console.log("用户未登录，跳转到登录页面");
  uni.navigateTo({
    url: "/pages/login/login-from-mine",
  });
};

// 订单类型点击事件
const handleOrderType = (type) => {
  console.log("点击了订单类型:", type);
  // 这里可以根据不同类型跳转到相应的订单页面
};

// 工具类型点击事件
const handleToolType = (type) => {
  console.log("点击了工具类型:", type);
  // 这里可以根据不同类型跳转到相应的工具页面
};

// 功能列表点击事件
const handleFunction = (type) => {
  console.log("点击了功能:", type);
  // 这里可以根据不同功能类型跳转到相应的功能页面
};

// 退出登录处理函数
const handleLogout = async () => {
  console.log("用户退出登录");
  
  // 显示加载提示
  uni.showLoading({
    title: '退出登录中...'
  });
  
  try {
    // 调用store的登出方法（内部会调用API）
    await userStore.logout();
    
    // 显示成功提示
    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    });
    
    // 延迟后刷新页面
    setTimeout(() => {
      // 刷新当前页面
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.route === 'pages/mine/mine') {
        // 如果在个人中心页，刷新页面
        currentPage.onLoad();
      }
    }, 1000);
  } catch (error) {
    console.error('退出登录失败:', error);
    uni.showToast({
      title: '退出失败，请重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background-color: #fff;
}

// 用户信息区
.user-info {
  display: flex;
  align-items: center;
  margin: 20rpx;
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

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
      font-size: 48rpx;
      font-weight: 450;
      color: #333;
      margin-bottom: 8rpx;
    }

    .login-desc {
      font-size: 26rpx;
      color: #333;
    }
  }

  .profile-link {
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 36rpx;
    }

    .profile-text {
      font-size: 26rpx;
      color: #999;
    }
  }
}

// 订单部分样式
.order-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }

    .all-orders {
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 36rpx;
      }

      .all-orders-text {
        font-size: 28rpx;
        color: #999;
      }

      .all-orders-arrow {
        margin-left: 6rpx;
        font-size: 28rpx;
        color: #ccc;
      }
    }
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
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .iconfont {
          font-size: 48rpx;
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
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }

    .all-tools {
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 36rpx;
      }

      .all-tools-text {
        font-size: 28rpx;
        color: #999;
      }

      .all-tools-arrow {
        margin-left: 6rpx;
        font-size: 28rpx;
        color: #ccc;
      }
    }
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

        .iconfont {
          font-size: 48rpx;
        }

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
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }

    .all-functions {
      display: flex;
      align-items: center;

      .iconfont {
        font-size: 36rpx;
      }

      .all-functions-text {
        font-size: 28rpx;
        color: #999;
      }

      .all-functions-arrow {
        margin-left: 6rpx;
        font-size: 28rpx;
        color: #ccc;
      }
    }
  }

  .functions-menu {
    display: flex;
    flex-direction: column;
    padding: 10rpx 0;

    .function-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;

      .iconfont {
        font-size: 36rpx;
      }

      .function-text {
        font-size: 26rpx;
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
}

.iconfont.icon-youjiantou {
  font-size: 24rpx;
  color: #ccc;
}

// 退出登录样式
.logout {
  margin-top: 20rpx;
}

.logout-text {
  color: #f56c6c !important;
  font-weight: 500;
}
</style>
 