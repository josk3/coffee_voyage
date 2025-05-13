<template>
  <view class="course-list-container">
    <view class="sidebar">
      <view
        v-for="(item, idx) in categories"
        :key="item.id"
        :class="['sidebar-item', { active: idx === activeIndex }]"
        @click="activeIndex = idx"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="main-content">
      <image
        class="banner"
        :src="categories[activeIndex].img"
        mode="aspectFill"
      />
      <view class="course-grid">
        <view
          class="course-card"
          v-for="course in courseList[activeIndex]"
          :key="course.title"
        >
          <image class="course-img" :src="course.img" mode="aspectFill" />
          <view class="course-title">{{ course.title }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const categories = [
  {
    id: 8,
    name: "西式面点课程",
    img: "https://mp-e9db93bd-d680-4781-9b05-0efa289ba320.cdn.bspapp.com/西式面点.jpg",
  },
  {
    id: 7,
    name: "中式面点课程",
    img: "https://mp-e9db93bd-d680-4781-9b05-0efa289ba320.cdn.bspapp.com/中式面点.jpg",
  },
  {
    id: 6,
    name: "中式烹调课程",
    img: "https://mp-e9db93bd-d680-4781-9b05-0efa289ba320.cdn.bspapp.com/中烹.jpg",
  },
  {
    id: 5,
    name: "茶艺师课程",
    img: "https://mp-e9db93bd-d680-4781-9b05-0efa289ba320.cdn.bspapp.com/茶艺.jpg",
  },
  {
    id: 9,
    name: "咖啡师课程",
    img: "https://mp-e9db93bd-d680-4781-9b05-0efa289ba320.cdn.bspapp.com/咖啡课程.jpg",
  },
  {
    id: 3,
    name: "西式烹调课程",
    img: "https://mp-e9db93bd-d680-4781-9b05-0efa289ba320.cdn.bspapp.com/西餐.jpg",
  },
];
const activeIndex = ref(3); // 默认选中"茶艺师课程"

const courseList = [
  [],
  [],
  [],
  [
    {
      img: "https://cdn.yizhida.com/tea-adv.png",
      title: "茶艺师高级课程",
    },
    {
      img: "https://cdn.yizhida.com/tea-mid.png",
      title: "茶艺师中级课程",
    },
    {
      img: "https://cdn.yizhida.com/tea-junior.png",
      title: "茶艺师初级课程",
    },
  ],
  [],
  [],
];
</script>

<style scoped>
.course-list-container {
  display: flex;
  height: 100vh;
  background: #f7f7f7;
}
.sidebar {
  width: 160rpx;
  background: #f8f8f8;
  padding-top: 30rpx;
  box-sizing: border-box;
  border-right: 1rpx solid #eee;
}
.sidebar-item {
  padding: 32rpx 0 32rpx 30rpx;
  font-size: 28rpx;
  color: #888;
  cursor: pointer;
}
.sidebar-item.active {
  color: #2a7be4;
  background: #fff;
  border-left: 6rpx solid #2a7be4;
  font-weight: bold;
}
.main-content {
  flex: 1;
  padding: 30rpx 30rpx 0 30rpx;
  box-sizing: border-box;
}
.banner {
  width: 100%;
  height: 520rpx;
  border-radius: 18rpx;
  object-fit: cover;
  margin-bottom: 30rpx;
}
.course-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx 30rpx;
}
.course-card {
  width: 45%;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
}
.course-img {
  width: 100%;
  height: 160rpx;
  border-radius: 16rpx 16rpx 0 0;
  object-fit: cover;
  background: #e6eaf0;
}
.course-title {
  font-size: 28rpx;
  color: #222;
  margin-top: 18rpx;
  text-align: center;
}
</style>
