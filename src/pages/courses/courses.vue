<template>
  <view class="courses-container">
    <view class="course-item" v-for="(course, index) in courseList" :key="index">
      <view class="course-card">
        <!-- 课程类型标签 -->
        <view class="course-type" :class="course.type === 'online' ? 'online' : 'offline'">
          {{ course.type === 'online' ? '在线网课' : '线下' }}
        </view>
        
        <!-- 课程标题 -->
        <view class="course-title">{{ course.title }}</view>
        
        <!-- 课程时间信息 -->
        <view class="course-time">{{ course.timeRange }} · {{ course.timeHours }}</view>
        
        <!-- 课程地点信息 -->
        <view class="course-location" v-if="course.location">{{ course.location }}</view>
        
        <!-- 班级信息 -->
        <view class="course-class" v-if="course.classSize">班容：{{ course.classSize }}</view>
        
        <!-- 讲师信息 -->
        <view class="tutor-info">
          <image class="tutor-avatar" :src="course.tutor.avatar" mode="aspectFill"></image>
          <view class="tutor-detail">
            <view class="tutor-name">{{ course.tutor.name }}</view>
            <view class="tutor-status">授课</view>
          </view>
        </view>
        
        <!-- 分割线 -->
        <view class="divider"></view>
        
        <!-- 底部价格区域 -->
        <view class="course-footer">
          <view class="course-tag" v-if="course.tag">{{ course.tag }}</view>
          <view class="course-price">¥ {{ course.price }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 课程数据
const courseList = ref([
  {
    type: 'offline',
    title: '【IELTS雅思综合】雅思强化班',
    timeRange: '2025.03.29-2025.07.01',
    timeHours: '08:00-12:30,13:00-17:30',
    location: '徐汇区上海南站地铁站教学点',
    tutor: {
      name: '总部特派教师1',
      avatar: '/static/images/avatar1.png'
    },
    tag: '剩余5',
    price: '20555'
  },
  {
    type: 'online',
    title: '【IELTS阅读】直播课4.21',
    timeRange: '2025.04.21-2025.05.03',
    timeHours: '晚上19:00-21:00',
    classSize: '大班',
    tutor: {
      name: '徐忆宁 ellen',
      avatar: '/static/images/avatar2.png'
    },
    price: '1950'
  },
  {
    type: 'online',
    title: '【IELTS口语】直播课5.6',
    timeRange: '2025.05.06-2025.05.18',
    timeHours: '晚上19:00-21:00',
    classSize: '大班',
    tutor: {
      name: '讲师',
      avatar: '/static/images/avatar3.png'
    },
    price: '1950'
  }
]);
</script>

<style lang="scss">
.courses-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.course-item {
  margin-bottom: 20rpx;
}

.course-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.course-type {
  display: inline-block;
  padding: 6rpx 16rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
  
  &.online {
    background-color: #F7C06A;
    color: #fff;
  }
  
  &.offline {
    background-color: #F7C06A;
    color: #fff;
  }
}

.course-title {
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #333;
}

.course-time, .course-location, .course-class {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.tutor-info {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.tutor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  background-color: #eee; /* 图片加载前的背景色 */
}

.tutor-name {
  font-size: 28rpx;
  color: #333;
}

.tutor-status {
  font-size: 24rpx;
  color: #999;
}

.divider {
  height: 1rpx;
  background-color: #eee;
  margin: 20rpx 0;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-tag {
  border: 1px solid #F7C06A;
  color: #F7C06A;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.course-price {
  font-size: 36rpx;
  color: #F7852A;
  font-weight: bold;
}
</style> 