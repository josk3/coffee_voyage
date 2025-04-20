<template>
  <view class="detail-container">
    <!-- 轮播图部分 -->
    <swiper class="swiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff" autoplay>
      <swiper-item v-for="(img, index) in shopDetail.images" :key="index">
        <image :src="img" mode="aspectFill" class="swiper-img"></image>
      </swiper-item>
    </swiper>
    
    <!-- 咖啡店信息 -->
    <view class="shop-info">
      <view class="shop-name">{{ shopDetail.name }}</view>
      
      <!-- 评分区域 -->
      <view class="rating-container">
        <view class="stars">
          <text 
            v-for="n in 5" 
            :key="n" 
            class="star" 
            :class="n <= Math.floor(shopDetail.rating) ? 'filled' : (n - 0.5 <= shopDetail.rating ? 'half' : '')"
          >★</text>
        </view>
        <text class="rating">{{ shopDetail.rating }}</text>
        <text class="review-count">{{ shopDetail.reviewCount }}条评价 ></text>
        <text class="price">¥{{ shopDetail.price }}/人</text>
      </view>
      
      <!-- 地址信息 -->
      <view class="address-container">
        <view class="address">
          <text class="icon location-icon">📍</text>
          <text class="address-text">{{ shopDetail.address }}</text>
          <text class="icon arrow-icon">></text>
        </view>
        <view class="phone">
          <text class="icon phone-icon">📞</text>
          <text class="phone-text">{{ shopDetail.phone }}</text>
          <text class="icon arrow-icon">></text>
        </view>
      </view>
    </view>
    
    <!-- 优惠活动 -->
    <view class="promotion-section">
      <view class="section-title">优惠活动</view>
      <view class="promotion-item" v-for="(promo, index) in shopDetail.promotions" :key="index">
        <text class="promo-tag">{{ promo.type }}</text>
        <text class="promo-desc">{{ promo.description }}</text>
      </view>
    </view>
    
    <!-- 评价区域 -->
    <view class="reviews-section">
      <view class="section-header">
        <text class="section-title">用户评价({{ shopDetail.reviewCount }})</text>
        <text class="view-all">查看全部 ></text>
      </view>
      
      <view class="review-item" v-for="(review, index) in shopDetail.reviews" :key="index">
        <view class="reviewer-info">
          <image :src="review.avatar" class="reviewer-avatar"></image>
          <view class="reviewer-meta">
            <text class="reviewer-name">{{ review.name }}</text>
            <view class="review-rating">
              <text 
                v-for="n in 5" 
                :key="n" 
                class="star small" 
                :class="n <= review.rating ? 'filled' : ''"
              >★</text>
              <text class="review-date">{{ review.date }}</text>
            </view>
          </view>
        </view>
        <text class="review-text">{{ review.text }}</text>
        
        <!-- 评价图片 -->
        <view class="review-images" v-if="review.images && review.images.length">
          <image 
            v-for="(img, imgIndex) in review.images" 
            :key="imgIndex"
            :src="img"
            mode="aspectFill"
            class="review-image"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const shopDetail = ref({
  id: 0,
  name: '瑞幸咖啡',
  rating: 4.1,
  reviewCount: 20,
  price: 15,
  address: '上海市静安区南京西路1788号',
  phone: '400-100-xxxx',
  images: [
    'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  ],
  promotions: [
    { type: '券', description: '新用户立减5元' },
    { type: '折', description: '下单立减2元' },
    { type: '赠', description: '消费满30元赠小食一份' }
  ],
  reviews: [
    {
      name: '用户1',
      avatar: '/static/images/avatar-default.png',
      rating: 5,
      date: '2023-12-01',
      text: '环境很好，服务员很热情，推荐大家来。咖啡味道醇厚，价格也实惠，下次还会再来的。',
      images: [
        'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
      ]
    },
    {
      name: '用户2',
      avatar: '/static/images/avatar-default.png',
      rating: 4,
      date: '2023-11-25',
      text: '出品稳定，环境优美，就是有时人太多了',
      images: []
    }
  ]
});

onMounted(() => {
  // 使用globalData获取数据
  const app = getApp();
  if (app.globalData && app.globalData.tempData) {
    shopDetail.value = Object.assign({}, shopDetail.value, app.globalData.tempData);
    // 使用完成后清空临时数据
    app.globalData.tempData = {};
  }
});
</script>

<style lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.swiper {
  height: 450rpx;
  
  .swiper-img {
    width: 100%;
    height: 100%;
  }
}

.shop-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.shop-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.rating-container {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  .stars {
    display: flex;
    margin-right: 10rpx;
    
    .star {
      color: #ddd;
      font-size: 36rpx;
      
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

.address-container {
  .address, .phone {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    
    .icon {
      margin-right: 15rpx;
      font-size: 32rpx;
    }
    
    .address-text, .phone-text {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
    
    .arrow-icon {
      color: #999;
    }
  }
  
  .address {
    border-bottom: 1px solid #f0f0f0;
  }
}

.promotion-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .promotion-item {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
    
    .promo-tag {
      font-size: 24rpx;
      color: #f76c3f;
      border: 1px solid #f76c3f;
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      margin-right: 15rpx;
    }
    
    .promo-desc {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.reviews-section {
  background-color: #fff;
  padding: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .view-all {
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .review-item {
    margin-bottom: 30rpx;
    
    .reviewer-info {
      display: flex;
      margin-bottom: 15rpx;
      
      .reviewer-avatar {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        margin-right: 15rpx;
      }
      
      .reviewer-meta {
        flex: 1;
        
        .reviewer-name {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 5rpx;
        }
        
        .review-rating {
          display: flex;
          align-items: center;
          
          .star.small {
            color: #ddd;
            font-size: 24rpx;
            
            &.filled {
              color: #f76c3f;
            }
          }
          
          .review-date {
            font-size: 24rpx;
            color: #999;
            margin-left: 10rpx;
          }
        }
      }
    }
    
    .review-text {
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
      margin-bottom: 15rpx;
    }
    
    .review-images {
      display: flex;
      flex-wrap: wrap;
      
      .review-image {
        width: 200rpx;
        height: 200rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        border-radius: 6rpx;
      }
    }
  }
}
</style> 