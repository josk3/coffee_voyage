<template>
  <view class="review-list-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="shop-name">{{ shopName }}的评价</text>
      <text class="total-reviews">({{ reviews.length }}条)</text>
    </view>
    
    <!-- 评价列表 -->
    <view class="review-list">
      <view class="review-item" v-for="(review, index) in reviews" :key="index">
        <!-- 用户信息和评分 -->
        <view class="reviewer-header">
          <view class="reviewer-info">
            <image :src="review.avatar" class="reviewer-avatar"></image>
            <view class="reviewer-meta">
              <view class="name-level">
                <text class="reviewer-name">{{ review.name }}</text>
                <text v-if="review.level" class="reviewer-level">{{ review.level }}</text>
              </view>
              <text class="review-date">{{ review.date }}</text>
            </view>
          </view>
          
          <!-- 评分 -->
          <view class="rating-tag">
            <text class="emoji">{{ review.rating >= 4 ? '😊' : '😐' }}</text>
            <text class="rating-label">{{ getRatingLabel(review.rating) }}</text>
            <view class="stars">
              <text 
                v-for="n in 5" 
                :key="n" 
                class="star small" 
                :class="n <= Math.floor(review.rating) ? 'filled' : (n - 0.5 <= review.rating ? 'half' : '')"
              >★</text>
            </view>
          </view>
        </view>
        
        <!-- 评价内容 -->
        <view class="review-content">
          <text class="review-text">{{ review.text }}</text>
          
          <!-- 评价图片 -->
          <view class="review-images" v-if="review.images && review.images.length">
            <image 
              v-for="(img, imgIndex) in review.images" 
              :key="imgIndex"
              :src="img"
              mode="aspectFill"
              class="review-image"
              @click="previewImage(review.images, imgIndex)"
            ></image>
          </view>
        </view>
        
        <!-- 分隔线 -->
        <view class="divider" v-if="index < reviews.length - 1"></view>
      </view>
    </view>
    
    <!-- 没有更多数据 -->
    <view class="no-more" v-if="reviews.length > 0">
      <text class="no-more-text">没有更多评价了</text>
    </view>
    
    <!-- 没有数据 -->
    <view class="empty-state" v-if="reviews.length === 0">
      <text class="empty-text">暂无评价</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const shopName = ref('');
const reviews = ref([]);

// 获取评分描述
const getRatingLabel = (rating) => {
  if (rating >= 4.5) return '很棒';
  if (rating >= 4) return '不错';
  if (rating >= 3) return '一般';
  if (rating >= 2) return '较差';
  return '很差';
};

// 预览图片
const previewImage = (images, current) => {
  uni.previewImage({
    current,
    urls: images
  });
};

onMounted(() => {
  // 获取页面参数
  const query = uni.$route ? uni.$route.query : uni.getEnterOptionsSync().query;
  const shopId = query.shopId;
  
  // 从全局数据获取评价数据
  const app = getApp();
  if (app.globalData && app.globalData.tempData) {
    shopName.value = app.globalData.tempData.shopName || '';
    reviews.value = app.globalData.tempData.reviews || [];
  } else {
    // 如果没有数据，可以根据shopId从服务器获取
    console.log('从服务器获取评价数据，shopId:', shopId);
    // 这里可以添加从服务器获取数据的逻辑
  }
});
</script>

<style lang="scss">
.review-list-container {
  min-height: 100vh;
  background-color: #fff;
  padding: 0 30rpx;
}

.page-header {
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
  
  .shop-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .total-reviews {
    font-size: 28rpx;
    color: #999;
    margin-left: 10rpx;
  }
}

.review-list {
  padding: 20rpx 0;
}

.review-item {
  padding: 20rpx 0;
  
  .reviewer-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    
    .reviewer-info {
      display: flex;
      
      .reviewer-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .reviewer-meta {
        .name-level {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          
          .reviewer-name {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
            margin-right: 10rpx;
          }
          
          .reviewer-level {
            font-size: 22rpx;
            color: #fff;
            background-color: #f5a623;
            padding: 2rpx 10rpx;
            border-radius: 10rpx;
          }
        }
        
        .review-date {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
    
    .rating-tag {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .emoji {
        font-size: 36rpx;
        margin-bottom: 5rpx;
      }
      
      .rating-label {
        font-size: 24rpx;
        color: #f76c3f;
        margin-bottom: 5rpx;
      }
      
      .stars {
        display: flex;
        
        .star {
          color: #ddd;
          font-size: 24rpx;
          
          &.filled {
            color: #f76c3f;
          }
          
          &.half {
            position: relative;
            
            &:after {
              content: '★';
              position: absolute;
              left: 0;
              top: 0;
              width: 50%;
              overflow: hidden;
              color: #f76c3f;
            }
          }
        }
      }
    }
  }
  
  .review-content {
    .review-text {
      font-size: 28rpx;
      color: #333;
      line-height: 1.6;
      margin-bottom: 20rpx;
    }
    
    .review-images {
      display: flex;
      flex-wrap: wrap;
      
      .review-image {
        width: 210rpx;
        height: 210rpx;
        margin-right: 15rpx;
        margin-bottom: 15rpx;
        border-radius: 8rpx;
      }
    }
  }
  
  .divider {
    height: 1px;
    background-color: #f0f0f0;
    margin: 30rpx 0 20rpx;
  }
}

.no-more {
  text-align: center;
  padding: 30rpx 0;
  
  .no-more-text {
    font-size: 26rpx;
    color: #999;
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
  
  .empty-text {
    font-size: 30rpx;
    color: #999;
  }
}
</style> 