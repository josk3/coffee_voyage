<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">首页</text>
    </view>
    <view class="description">
      <text>这是应用的首页，可以通过底部选项卡导航到其他页面</text>
    </view>
  </view>
</template>

<script setup>
// 页面逻辑
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
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
  margin-bottom: 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.description {
  padding: 30rpx;
  text-align: center;
  color: #666;
  font-size: 30rpx;
  line-height: 1.5;
}
</style>
