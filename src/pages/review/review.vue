<template>
  <view class="review-container">
    <!-- 评价列表 -->
    <view class="coffee-list">
      <view 
        class="coffee-item" 
        v-for="(item, index) in coffeeShops" 
        :key="index"
        @click="goToDetail(item)"
      >
        <!-- 咖啡店logo -->
        <view class="coffee-logo">
          <image :src="item.logo" mode="aspectFill" class="logo-image"></image>
        </view>
        
        <!-- 咖啡店信息 -->
        <view class="coffee-info">
          <!-- 咖啡店名称 -->
          <view class="coffee-name">{{ item.name }}</view>
          
          <!-- 评分区域 -->
          <view class="rating-container">
            <!-- 星级评分 -->
            <view class="stars">
              <text 
                v-for="n in 5" 
                :key="n" 
                class="star" 
                :class="n <= Math.floor(item.rating) ? 'filled' : (n - 0.5 <= item.rating ? 'half' : '')"
              >★</text>
            </view>
            
            <!-- 评分数值 -->
            <text class="rating">{{ item.rating }}</text>
            
            <!-- 评价数量 -->
            <text class="review-count">{{ item.reviewCount }}条</text>
            
            <!-- 人均价格 -->
            <text class="price">¥{{ item.price }}/人</text>
          </view>
          
          <!-- 评价内容 -->
          <view class="review-content">
            <!-- 用户头像 -->
            <image :src="item.reviewer.avatar" class="reviewer-avatar"></image>
            
            <!-- 评价文字 -->
            <text class="review-text">"{{ item.reviewText }}"</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 模拟咖啡店数据
const coffeeShops = ref([
  {
    id: 1,
    name: 'LAVAZZA 拉瓦萨咖啡',
    logo: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg', // 占位图片路径
    rating: 4.5,
    reviewCount: 5,
    price: 32,
    reviewer: {
      id: 101,
      name: '用户1',
      avatar: '/static/images/avatar-default.png' // 占位图片路径
    },
    reviewText: '环境很好,服务员很热情,推荐大家来'
  },
  {
    id: 2,
    name: 'Manner Coffee',
    logo: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg', // 占位图片路径
    rating: 3.8,
    reviewCount: 13,
    price: 22,
    reviewer: {
      id: 102,
      name: '用户2',
      avatar: '/static/images/avatar-default.png' // 占位图片路径
    },
    reviewText: '出品稳定,环境优美'
  },
  {
    id: 3,
    name: '星巴克',
    logo: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg', // 占位图片路径
    rating: 4.1,
    reviewCount: 86,
    price: 32,
    reviewer: {
      id: 103,
      name: '用户3',
      avatar: '/static/images/avatar-default.png' // 占位图片路径
    },
    reviewText: '很喜欢这个店的位置,店内装修简洁敞亮'
  },
  {
    id: 4,
    name: 'Tims 天好咖啡',
    logo: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg', // 占位图片路径
    rating: 4.0,
    reviewCount: 44,
    price: 22,
    reviewer: {
      id: 104,
      name: '用户4',
      avatar: '/static/images/avatar-default.png' // 占位图片路径
    },
    reviewText: '服务很专业'
  }
]);

// 跳转到详情页
const goToDetail = (item) => {
  console.log('查看咖啡店详情:', item.name);
  // 这里可以添加页面跳转逻辑
  // uni.navigateTo({
  //   url: `/pages/coffee-detail/coffee-detail?id=${item.id}`
  // });
};
</script>

<style lang="scss">
.review-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 10rpx 0;
}

.coffee-list {
  padding: 0 20rpx;
}

.coffee-item {
  display: flex;
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.coffee-logo {
  width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  
  .logo-image {
    width: 100%;
    height: 100%;
    border-radius: 6rpx;
  }
}

.coffee-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.coffee-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.rating-container {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  .stars {
    display: flex;
    margin-right: 10rpx;
    
    .star {
      color: #ddd;
      font-size: 40rpx;
      
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
  
  .rating {
    font-size: 32rpx;
    color: #f76c3f;
    font-weight: bold;
    margin-right: 20rpx;
  }
  
  .review-count {
    font-size: 28rpx;
    color: #666;
    margin-right: 20rpx;
  }
  
  .price {
    font-size: 28rpx;
    color: #666;
  }
}

.review-content {
  display: flex;
  align-items: center;
  
  .reviewer-avatar {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    margin-right: 15rpx;
    background-color: #eee; // 占位背景色
  }
  
  .review-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.4;
  }
}
</style> 