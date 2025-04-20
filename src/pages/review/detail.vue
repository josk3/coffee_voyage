<template>
  <view class="detail-container">
    <!-- 轮播图部分 -->
    <swiper class="swiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff" autoplay>
      <swiper-item v-for="(img, index) in shopDetail.images" :key="index">
        <image :src="img" mode="aspectFill" class="swiper-img" @click="handleImageClick(index)"></image>
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
        <text class="review-count" @click="viewAllReviews">{{ shopDetail.reviewCount }}条评价 ></text>
        <text class="price">¥{{ shopDetail.price }}/人</text>
      </view>
      
      <!-- 地址信息 -->
      <view class="address-container">
        <view class="address" @click="handleAddressClick">
          <text class="icon location-icon">📍</text>
          <text class="address-text">{{ shopDetail.address }}</text>
          <text class="icon arrow-icon">></text>
        </view>
        <view class="phone" @click="handlePhoneClick">
          <text class="icon phone-icon">📞</text>
          <text class="phone-text">{{ shopDetail.phone }}</text>
          <text class="icon arrow-icon">></text>
        </view>
      </view>
    </view>
    
    <!-- 优惠活动 -->
    <view class="promotion-section">
      <view class="section-title">优惠活动</view>
      <view class="promotion-item" v-for="(promo, index) in shopDetail.promotions" :key="index" @click="handlePromoClick(promo)">
        <text class="promo-tag">{{ promo.type }}</text>
        <text class="promo-desc">{{ promo.description }}</text>
      </view>
    </view>
    
    <!-- 推荐菜区域 -->
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">推荐菜</text>
        <text class="view-all" @click="viewAllRecommends">查看全部 ></text>
      </view>
      
      <scroll-view class="recommend-scroll" scroll-x="true" show-scrollbar="false">
        <view class="recommend-list">
          <view class="recommend-item" v-for="(item, index) in recommendItems" :key="index" @click="viewRecommendDetail(item)">
            <image :src="item.image" mode="aspectFill" class="recommend-image"></image>
            <text class="recommend-name">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 评价区域 -->
    <view class="reviews-section">
      <view class="section-header">
        <text class="section-title">用户评价({{ shopDetail.reviewCount }})</text>
        <text class="view-all" @click="viewAllReviews">查看全部 ></text>
      </view>
      
      <view class="review-item" v-for="(review, index) in shopDetail.reviews" :key="index">
        <view class="reviewer-info">
          <image :src="review.avatar" class="reviewer-avatar" @click="viewUserProfile(review)"></image>
          <view class="reviewer-meta">
            <text class="reviewer-name" @click="viewUserProfile(review)">{{ review.name }}</text>
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
            @click="viewReviewImage(review, imgIndex)"
          ></image>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="footer-actions">
      <view class="action-btn share-btn" @click="handleShare">
        <text class="action-icon">💬</text>
        <text class="action-text">分享</text>
      </view>
      <view class="action-btn favorite-btn" @click="handleFavorite">
        <text class="action-icon">❤️</text>
        <text class="action-text">收藏</text>
      </view>
      <view class="action-btn write-review-btn" @click="handleWriteReview">写评价</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const shopDetail = ref({
  id: 0,
  name: '瑞幸咖啡',
  rating: 4.1,
  reviewCount: 0,
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
    },
    {
      name: '匿名用户',
      avatar: '/static/images/avatar-default.png',
      level: 'Lv4',
      date: '2月26日',
      rating: 4.5,
      text: '在食堂里面开的，没啥服务，做好了自己拿就行，味道还可以，价格还行，提神醒脑来一杯，环境还行，座位不多，做咖啡的速度还是挺快的，下单一会儿就做好了，可以快速拿到，不推荐饭点去，可能需要等，人会多一点，其他时候还好',
      images: [
        '/static/images/review-image.jpg'
      ]
    }
  ]
});

// 推荐菜数据
const recommendItems = ref([
  {
    id: 1,
    name: '小黄油拿铁',
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    price: 25
  },
  {
    id: 2,
    name: '太妃榛香拿铁',
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    price: 28
  },
  {
    id: 3,
    name: '费尔岛拿铁',
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    price: 30
  },
  {
    id: 4,
    name: '西梅拿铁',
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    price: 26
  }
]);

// 计算总评价数
const totalReviewCount = computed(() => {
  return shopDetail.value.reviews.length;
});

onMounted(() => {
  // 使用globalData获取数据
  const app = getApp();
  if (app.globalData && app.globalData.tempData) {
    shopDetail.value = Object.assign({}, shopDetail.value, app.globalData.tempData);
  }
  
  // 更新评价数量
  shopDetail.value.reviewCount = totalReviewCount.value;
});

// 点击轮播图
const handleImageClick = (index) => {
  console.log('点击了轮播图:', index);
  // 预览图片
  uni.previewImage({
    current: index,
    urls: shopDetail.value.images
  });
};

// 查看全部评价
const viewAllReviews = () => {
  console.log('查看全部评价');
  
  // 将评价数据存储到全局变量中
  const app = getApp();
  app.globalData.tempData = {
    shopName: shopDetail.value.name,
    reviews: shopDetail.value.reviews
  };
  
  // 跳转到评价列表页
  uni.navigateTo({
    url: '/pages/review/review-list?shopId=' + shopDetail.value.id
  });
};

// 点击地址
const handleAddressClick = () => {
  console.log('点击了地址:', shopDetail.value.address);
  // 打开地图
  uni.showToast({
    title: '即将打开地图',
    icon: 'none'
  });
};

// 点击电话
const handlePhoneClick = () => {
  console.log('点击了电话:', shopDetail.value.phone);
  uni.showModal({
    title: '提示',
    content: `是否拨打电话 ${shopDetail.value.phone}？`,
    success: function (res) {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: shopDetail.value.phone,
          fail: () => {
            uni.showToast({
              title: '拨打电话失败',
              icon: 'none'
            });
          }
        });
      }
    }
  });
};

// 点击优惠活动
const handlePromoClick = (promo) => {
  console.log('点击了优惠活动:', promo);
  uni.showToast({
    title: `${promo.type}: ${promo.description}`,
    icon: 'none'
  });
};

// 查看用户资料
const viewUserProfile = (review) => {
  console.log('查看用户资料:', review.name);
  uni.showToast({
    title: '暂未开放此功能',
    icon: 'none'
  });
};

// 查看评价图片
const viewReviewImage = (review, imgIndex) => {
  console.log('查看评价图片:', imgIndex);
  // 预览图片
  uni.previewImage({
    current: imgIndex,
    urls: review.images
  });
};

// 分享
const handleShare = () => {
  console.log('分享');
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

// 收藏
const handleFavorite = () => {
  console.log('收藏');
  uni.showToast({
    title: '收藏成功',
    icon: 'success'
  });
};

// 写评价
const handleWriteReview = () => {
  console.log('写评价');
  
  // 从console中检查shopDetail的name值
  console.log('店铺信息:', shopDetail.value.name, shopDetail.value.id);
  
  // 将店铺信息存储到全局变量中
  const app = getApp();
  if (!app.globalData) {
    app.globalData = {};
  }
  
  // 使用全局数据传递商店信息
  app.globalData.shopInfo = {
    id: shopDetail.value.id,
    name: shopDetail.value.name,
    address: shopDetail.value.address
  };
  
  console.log('全局数据已设置:', app.globalData.shopInfo);
  
  // 直接跳转到写评价页面，无需传递复杂参数
  uni.navigateTo({
    url: '/pages/review/write-review'
  });
};

// 查看全部推荐菜
const viewAllRecommends = () => {
  console.log('查看全部推荐菜');
  // 跳转到推荐菜列表页面
  uni.navigateTo({
    url: `/pages/review/recommend-list?shopId=${shopDetail.value.id}&shopName=${encodeURIComponent(shopDetail.value.name)}`
  });
};

// 查看推荐菜详情
const viewRecommendDetail = (item) => {
  console.log('查看推荐菜详情:', item.name);
  uni.showToast({
    title: `查看${item.name}详情`,
    icon: 'none'
  });
};
</script>

<style lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; /* 为底部操作栏留出空间 */
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

.recommend-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
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
  
  .recommend-scroll {
    width: 100%;
    white-space: nowrap;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .recommend-list {
    display: inline-flex;
    padding: 10rpx 0;
  }
  
  .recommend-item {
    display: inline-block;
    width: 240rpx;
    margin-right: 20rpx;
    
    .recommend-image {
      width: 240rpx;
      height: 180rpx;
      border-radius: 8rpx;
    }
    
    .recommend-name {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-top: 12rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

/* 底部操作栏 */
.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  
  .action-btn {
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
    font-size: 28rpx;
    
    &.share-btn, &.favorite-btn {
      width: 150rpx;
      color: #666;
      flex-direction: column;
      
      .action-icon {
        font-size: 40rpx;
        margin-bottom: 5rpx;
      }
      
      .action-text {
        font-size: 24rpx;
      }
    }
    
    &.write-review-btn {
      flex: 1;
      margin-left: 30rpx;
      background-color: #f76c3f;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style> 