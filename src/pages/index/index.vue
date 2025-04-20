<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button class="nav-button" @click="navigateToCourses">查看课程列表</button>
    <button class="nav-button mine-btn" @click="navigateToMine">我的</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {
    navigateToCourses() {
      wx.navigateTo({
        url: '/pages/courses/courses',  
      })
    },
    navigateToMine() {
      wx.navigateTo({
        url: '/pages/mine/mine',  
      })
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.nav-button {
  margin-top: 50rpx;
  background-color: #F7C06A;
  color: #fff;
  border-radius: 10rpx;
  padding: 20rpx 40rpx;
  font-size: 32rpx;
}

.mine-btn {
  background-color: #5D8FFF;
}
</style>
