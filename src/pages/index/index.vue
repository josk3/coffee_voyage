<template>
  <view class="page-content">
    <view class="carousel-container">
      <swiper
        :indicator-dots="false"
        :autoplay="false"
        circular="false"
        @change="onChange"
        class="swiper"
      >
        <swiper-item v-for="(img, idx) in images" :key="idx">
          <image
            :src="img"
            class="swiper-image"
            mode="aspectFill"
            @click="handleImageClick(idx + 1)"
          />
        </swiper-item>
      </swiper>
      <view class="indicator">{{ currentIndex }}/{{ total }}</view>
    </view>
    <view class="course-section">
      <view class="section-header">
        <text class="section-title">课程分类</text>
        <view class="section-nav">
          <text class="nav-item" :class="{active: activeNav==='系统'}" @click="switchNav('系统')">系统</text>
          <text class="nav-separator">|</text>
          <text class="nav-item" :class="{active: activeNav==='兴趣'}" @click="switchNav('兴趣')">兴趣</text>
          <text class="nav-separator">|</text>
          <text class="nav-item" :class="{active: activeNav==='全面'}" @click="switchNav('全面')">全面</text>
        </view>
        <text class="more" @click="handleMoreClick">更多 ></text>
      </view>
      <view class="course-grid">
        <view class="course-card" v-for="(cat, idx) in categories" :key="idx" @click="handleCategoryClick(cat)">
          <view class="card-inner">
            <view class="card-image-wrapper">
              <image :src="cat.img" class="card-image" mode="aspectFill" />
              <view class="image-mask"></view>
            </view>
            <view class="card-desc">
              <text class="desc-text">轻松掌握技能—提升职业能级</text>
            </view>
            <view class="card-title">
              <text class="title-text">{{ cat.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 专辑课程模块 -->
    <view class="album-section">
      <view class="section-title">专辑课程</view>
      
      <!-- 大师卡片 -->
      <view class="master-card" @click="handleMasterCardClick">
        <image class="master-avatar" src="https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg" mode="aspectFill"></image>
        <view class="master-info">
          <view class="master-title">中式烹饪合集</view>
          <view class="master-desc">周良存大师是一位拥有丰富经验的资深级中国烹饪大师，上海市首席技师。</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
const images = ref([
  'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
  'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
  'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg'
]);
const total = images.value.length;
const currentIndex = ref(1);
const onChange = e => { currentIndex.value = e.detail.current + 1; };
const handleImageClick = idx => { console.log(`点击了第${idx}张图片`); };

const activeNav = ref('系统');
const switchNav = nav => { activeNav.value = nav; console.log('切换导航:', nav); };
const handleMoreClick = () => { 
  console.log('跳转到商品分组页面'); 
  uni.navigateTo({
    url: '/pages/index/product-group'
  });
};

const categories = ref([
  { name: '西式面点课程', img: images.value[0] },
  { name: '中式面点课程', img: images.value[0] },
  { name: '中式烹调课程', img: images.value[0] },
  { name: '茶艺师课程', img: images.value[0] },
  { name: '咖啡师课程', img: images.value[0] },
  { name: '西式烹调课程', img: images.value[0] }
]);
const handleCategoryClick = cat => { console.log('点击课程分类:', cat.name); };

// 新增点击事件处理函数
const handleMasterCardClick = () => { console.log('点击了大师卡片'); };
</script>

<style>
.page-content {
  background-color: #f5f5f5;
}
.carousel-container {
  margin: 20rpx;
  position: relative;
  width: auto;
  height: 0;
  padding-top: 100%;
  border-radius: 24rpx;
  overflow: hidden;
}
.swiper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.swiper-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}
.indicator {
  position: absolute;
  top: 10rpx;
  right: 20rpx;
  padding: 4rpx 10rpx;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: 12rpx;
  font-size: 24rpx;
}
/* 课程分类模块 */
.course-section {
  padding: 20rpx;
  background-color: #fff;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-nav {
  display: flex;
  align-items: center;
  flex: 1;
}
.nav-item {
  font-size: 28rpx;
  color: #666;
  margin: 0 10rpx;
}
.nav-item.active {
  color: #1296db;
}
.nav-separator {
  font-size: 28rpx;
  color: #999;
}
.more {
  font-size: 24rpx;
  color: #999;
}
.course-grid {
  display: flex;
  flex-wrap: wrap;
}
.course-card {
  width: calc((100% - 40rpx) / 3);
  margin-bottom: 20rpx;
  margin-right: 20rpx;
}
.course-card:nth-of-type(3n) {
  margin-right: 0;
}
.card-inner {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20rpx;
  overflow: hidden;
  height: 160rpx;
}
.card-image-wrapper {
  position: relative;
  width: 200rpx;
  height: 100%;
  overflow: hidden;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-mask {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 100%;
  background: linear-gradient(to right, rgba(249,249,249,0) 30%, #f0f0f0);
}
.card-desc {
  position: relative;
  /* height: 100%; */
  width: 20rpx;
  border-right: 1px solid #e0786f;
  border-left: 1px solid #e0786f;
  margin: 10rpx 10rpx 10rpx 0;
  /* margin: 10rpx 10rpx 10rpx 0; */
  display: flex;
  justify-content: center;
  /* padding-top: 10rpx; */
  box-sizing: border-box;
}
.desc-text {
  font-size: 9rpx;
  color: #777;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 1rpx;
}
.card-title {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(207, 231, 204, 0.3); */
}
.title-text {
  font-size: 24rpx;
  color: #7b9351;
  font-weight: bold;
  writing-mode: vertical-rl;
  text-orientation: upright;
  padding: 0 10rpx 0 0;
}

/* 专辑课程模块样式 */
.album-section {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.master-card {
  display: flex;
  align-items: center;
  background-color: #3b79b6;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.master-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 3rpx solid #fff;
}

.master-info {
  margin-left: 20rpx;
  flex: 1;
}

.master-title {
  font-size: 30rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.master-desc {
  font-size: 24rpx;
  color: #e0e0e0;
  line-height: 1.4;
}
</style>