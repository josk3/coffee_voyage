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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useCoffeeShopStore } from '@/stores/coffeeShop';

// 咖啡店详情数据
const shopDetail = ref({
  id: '',
  name: '',
  rating: 0,
  reviewCount: 0,
  price: 0,
  images: [],
  reviews: []
});

// 从store中获取数据
const coffeeShopStore = useCoffeeShopStore();

// 推荐菜数据 (暂时保留静态数据，API未提供推荐菜接口)
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

// API基础URL
const baseUrl = 'http://localhost:3000/api';

// 获取咖啡店详情数据
const fetchShopDetail = (shopId) => {
  // 检查store中是否已有数据
  if (coffeeShopStore.detail && 
     ((coffeeShopStore.detail.id && coffeeShopStore.detail.id === shopId) || 
      (coffeeShopStore.detail._id && coffeeShopStore.detail._id === shopId))) {
    shopDetail.value = coffeeShopStore.detail;
    return;
  }
  
  // 如果store中没有数据，则请求新数据
  uni.showLoading({
    title: '加载中...'
  });
  
  coffeeShopStore.fetchCoffeeShopDetail(shopId)
    .then(data => {
      console.log('获取到的咖啡店详情:', JSON.stringify(data));
      shopDetail.value = data;
    })
    .catch(err => {
      uni.showToast({
        title: '获取数据失败',
        icon: 'none',
        duration: 2000
      });
      console.error('获取咖啡店详情失败:', err);
    })
    .finally(() => {
      uni.hideLoading();
    });
};

// 页面数据刷新方法
const fetchData = (id) => {
  // 获取咖啡店详情的代码，根据实际情况修改
  uni.showLoading({
    title: '加载中...',
    mask: true
  });
  
  // 使用store中的方法获取数据
  coffeeShopStore.fetchCoffeeShopDetail(id)
    .then(response => {
      console.log('刷新成功，获取到最新数据');
      shopDetail.value = response;
    })
    .catch(error => {
      console.error('刷新数据失败', error);
      uni.showToast({
        title: '刷新数据失败',
        icon: 'none'
      });
    })
    .finally(() => {
      uni.hideLoading();
    });
};

onMounted(() => {
  // 获取路由参数中的shopId
  let shopId = '';
  
  // 尝试从页面参数获取shopId
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage && currentPage.options) {
    shopId = currentPage.options.id || '';
  }
  
  if (shopId) {
    fetchShopDetail(shopId);
  } else {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    });
  }
  
  // 添加全局事件监听，用于刷新详情数据
  uni.$on('refreshShopDetail', (data) => {
    console.log('收到刷新事件:', data);
    if (data && data.shopId) {
      fetchData(data.shopId);
    }
  });
});

onUnmounted(() => {
  // 页面卸载时移除事件监听，防止内存泄漏
  uni.$off('refreshShopDetail');
});

// 点击轮播图
const handleImageClick = (index) => {
  // 预览图片
  uni.previewImage({
    current: index,
    urls: shopDetail.value.images
  });
};

// 查看全部评价
const viewAllReviews = () => {
  // 显示加载提示
  uni.showLoading({
    title: '加载中...'
  });
  
  // 使用store获取评价数据
  const shopId = shopDetail.value.id;
  console.log('查看全部评价的咖啡店ID:', shopDetail.value);
  
  if (!shopId) {
    uni.hideLoading();
    uni.showToast({
      title: '商店ID不存在',
      icon: 'none'
    });
    return;
  }
  
  // 添加错误处理和超时处理
  const requestTimeout = setTimeout(() => {
    uni.hideLoading();
    console.warn('获取评价请求超时');
    // 超时时也跳转，避免用户等待
    uni.navigateTo({
      url: `/pages/review/review-list?shopId=${shopId}`
    });
  }, 5000); // 5秒超时
  
  // 调用store方法获取评价
  coffeeShopStore.fetchShopReviews(shopId)
    .then(reviews => {
      // 清除超时
      clearTimeout(requestTimeout);
      
      // 评价加载成功，跳转到评价列表页
      uni.hideLoading();
      console.log('获取到评价数据，准备跳转:', reviews && reviews.length);
      
      uni.navigateTo({
        url: `/pages/review/review-list?shopId=${shopId}`
      });
    })
    .catch(err => {
      // 清除超时
      clearTimeout(requestTimeout);
      
      // 即使出错也跳转，依靠review-list页面的错误处理
      uni.hideLoading();
      console.error('获取评价列表失败:', err);
      
      // 即使失败也跳转
      uni.navigateTo({
        url: `/pages/review/review-list?shopId=${shopId}`
      });
    });
};

// 查看用户资料
const viewUserProfile = (review) => {
  uni.showToast({
    title: '暂未开放此功能',
    icon: 'none'
  });
};

// 查看评价图片
const viewReviewImage = (review, imgIndex) => {
  // 预览图片
  uni.previewImage({
    current: imgIndex,
    urls: review.images
  });
};

// 分享
const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

// 收藏
const handleFavorite = () => {
  uni.showToast({
    title: '收藏成功',
    icon: 'success'
  });
};

// 写评价
const handleWriteReview = () => {
  // 使用全局数据传递商店信息
  const app = getApp();
  if (!app.globalData) {
    app.globalData = {};
  }
  
  app.globalData.shopInfo = {
    id: shopDetail.value.id,
    name: shopDetail.value.name
  };
  
  // 跳转到写评价页面
  uni.navigateTo({
    url: '/pages/review/write-review'
  });
};

// 查看全部推荐菜
const viewAllRecommends = () => {
  // 跳转到推荐菜列表页面
  uni.navigateTo({
    url: `/pages/review/recommend-list?shopId=${shopDetail.value.id}&shopName=${encodeURIComponent(shopDetail.value.name)}`
  });
};

// 查看推荐菜详情
const viewRecommendDetail = (item) => {
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
      word-break: break-word;
      white-space: normal;
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