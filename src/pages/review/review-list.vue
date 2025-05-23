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
          
          <!-- 删除按钮 -->
          <view class="review-actions">
            <view class="delete-btn" @click="confirmDelete(review, index)">删除评价</view>
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
import { useCoffeeShopStore } from '@/stores/coffeeShop';

const shopName = ref('');
const reviews = ref([]);
const shopId = ref('');
// 添加删除状态标记
const isDeleting = ref(false);

// 从store获取数据
const coffeeShopStore = useCoffeeShopStore();

// 已经删除过的评价ID集合，避免重复删除
const deletedReviewIds = ref(new Set());

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

// 确认删除评价
const confirmDelete = (review, index) => {
  uni.showModal({
    title: '删除评价',
    content: '确定要删除这条评价吗？',
    confirmColor: '#f76c3f',
    success: (res) => {
      if (res.confirm) {
        deleteReview(review, index);
      }
    }
  });
};

// 删除评价
const deleteReview = async (review, index) => {
  // 获取评论ID
  const reviewId = review._id || review.id;
  
  if (!reviewId) {
    uni.showToast({
      title: '评价ID不存在',
      icon: 'none'
    });
    return;
  }
  
  // 防止重复删除同一评价
  if (deletedReviewIds.value.has(reviewId)) {
    console.log('该评价已被删除，忽略重复操作');
    return;
  }
  
  // 防止删除操作中重复点击
  if (isDeleting.value) {
    console.log('正在处理删除操作，请稍候');
    return;
  }
  
  // 标记删除中状态
  isDeleting.value = true;
  
  // 记录要删除的评价ID，防止重复删除
  deletedReviewIds.value.add(reviewId);
  
  // 显示加载提示
  uni.showLoading({
    title: '删除中...',
    mask: true
  });
  
  try {
    await coffeeShopStore.deleteReview(shopId.value, reviewId);
    
    // 删除成功后，直接更新当前列表
    reviews.value = reviews.value.filter(item => {
      const itemId = item._id || item.id;
      return itemId !== reviewId;
    });
    
    // 触发全局事件，通知其他页面刷新店铺详情
    uni.$emit('refreshShopDetail', {
      shopId: shopId.value,
      timestamp: Date.now()
    });
    
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('删除评价失败:', error);
    uni.showToast({
      title: error.message || '删除失败',
      icon: 'none'
    });
    
    // 删除失败时，从已删除集合中移除该ID
    deletedReviewIds.value.delete(reviewId);
  } finally {
    uni.hideLoading();
    isDeleting.value = false;
  }
};

// 从服务器获取评价数据
const fetchReviews = (id) => {
  // 请求新数据
  uni.showLoading({
    title: '加载中...'
  });
  
  return coffeeShopStore.fetchShopReviews(id)
    .then(data => {
      // 创建一个全新的数组，完全断开与store的引用关系
      reviews.value = JSON.parse(JSON.stringify(data));
      return data;
    })
    .catch(err => {
      uni.showToast({
        title: '获取评价失败',
        icon: 'none'
      });
      console.error('获取评价失败:', err);
      throw err;
    })
    .finally(() => {
      uni.hideLoading();
    });
};

// 从服务器获取咖啡店信息
const fetchShopInfo = async (id) => {
  // 如果store中已有详情数据，直接使用
  if (coffeeShopStore.detail) {
    shopName.value = coffeeShopStore.detail.name;
    return Promise.resolve(coffeeShopStore.detail);
  }
  
  // 否则请求新数据
  try {
    const shopInfo = await coffeeShopStore.fetchShopInfo(id);
    shopName.value = shopInfo.name;
    return shopInfo;
  } catch (error) {
    console.error('获取商店信息失败:', error);
    throw error;
  }
};

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage && currentPage.options) {
    shopId.value = currentPage.options.shopId || '';
    
    if (shopId.value) {
      // 获取咖啡店信息和评价
      Promise.all([
        fetchShopInfo(shopId.value),
        fetchReviews(shopId.value)
      ])
      .catch(err => {
        console.error('初始化数据失败:', err);
      });
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
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
      word-break: break-word;
      white-space: normal;
    }
    
    .review-images {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20rpx;
      
      .review-image {
        width: 210rpx;
        height: 210rpx;
        margin-right: 15rpx;
        margin-bottom: 15rpx;
        border-radius: 8rpx;
      }
    }
    
    .review-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10rpx;
      
      .delete-btn {
        font-size: 26rpx;
        color: #f76c3f;
        background-color: #fff;
        border: 1px solid #f76c3f;
        border-radius: 30rpx;
        padding: 6rpx 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
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