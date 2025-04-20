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
    reviewText: '很喜欢这个店的位置,店内装修简洁敞亮,店内装修简洁敞亮店内装修简洁敞亮店内装修简洁敞亮'
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
  
  // 构建需要传递的数据对象
  const itemData = {
    id: item.id,
    name: item.name,
    rating: item.rating,
    reviewCount: item.reviewCount,
    price: item.price,
    logo: item.logo,
    address: '上海市静安区南京西路1788号', // 示例地址，实际应从item中获取
    phone: '400-100-xxxx', // 示例电话，实际应从item中获取
    images: [
      item.logo, 
      item.logo, 
      item.logo
    ], // 使用logo作为轮播图示例，实际应从item中获取多张图片
    promotions: [
      { type: '券', description: '新用户立减5元' },
      { type: '折', description: '下单立减2元' }
    ], // 示例优惠信息，实际应从item中获取
    reviews: [
      {
        name: item.reviewer.name,
        avatar: item.reviewer.avatar,
        rating: item.rating,
        date: '2023-12-01', // 示例日期，实际应从item中获取
        text: item.reviewText,
        images: []
      }
    ] // 示例评论，使用item中的评论信息
  };
  
  // 通过globalData传递数据
  getApp().globalData.tempData = itemData;
  
  // 跳转到详情页，只传递一个ID参数
  uni.navigateTo({
    url: `/pages/review/detail?id=${item.id}`
  });
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
  font-size: 32rpx;
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
  margin-top: 10rpx;
  min-height: 50rpx;
  align-items: center;
  
  .reviewer-avatar {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    margin-right: 15rpx;
    flex-shrink: 0;
    background-color: #eee;
  }
  
  .review-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.4;
    flex: 1;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style> 