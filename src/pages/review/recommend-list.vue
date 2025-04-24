<template>
  <view class="recommend-list-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">网友推荐菜 ({{ totalCount }})</text>
        <view class="search-icon" @click="handleSearch">
          <text class="icon">🔍</text>
        </view>
      </view>
    </view>
    
    <!-- 推荐菜列表 -->
    <view class="recommend-list">
      <view 
        class="recommend-item" 
        v-for="(item, index) in recommendItems" 
        :key="item.id"
        @click="viewItemDetail(item)"
      >
        <!-- TOP标签 -->
        <view class="top-tag" v-if="index < 5">TOP {{ index + 1 }}</view>
        
        <!-- 图片区域 -->
        <view class="item-image-container">
          <image :src="item.image" mode="aspectFill" class="item-image"></image>
        </view>
        
        <!-- 商品信息 -->
        <view class="item-info">
          <view class="item-name">{{ item.name }}</view>
          <view class="item-price">¥{{ item.price }}</view>
        </view>
        
        <!-- 添加按钮 -->
        <view class="add-btn" @click.stop="addToCart(item)">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCoffeeShopStore } from '@/stores/coffeeShop';

// 获取store
const coffeeShopStore = useCoffeeShopStore();

// 推荐菜总数
const totalCount = computed(() => {
  return coffeeShopStore.recommendItems.length;
});

// 推荐菜数据，直接从store获取
const recommendItems = computed(() => coffeeShopStore.recommendItems);

// 查看商品详情
const viewItemDetail = (item) => {
  console.log('查看商品详情:', item.name);
  uni.showToast({
    title: `查看${item.name}详情`,
    icon: 'none'
  });
  
  // 实际逻辑：跳转到商品详情页
  // uni.navigateTo({
  //   url: `/pages/product/detail?id=${item.id}`
  // });
};

// 添加到购物车
const addToCart = (item) => {
  console.log('添加到购物车:', item.name);
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  });
  
  // 实际逻辑：调用后端API添加商品到购物车
  // uni.request({
  //   url: 'https://api.example.com/cart/add',
  //   method: 'POST',
  //   data: {
  //     productId: item.id,
  //     quantity: 1
  //   },
  //   success: (res) => {
  //     if (res.data.success) {
  //       uni.showToast({
  //         title: '已加入购物车',
  //         icon: 'success'
  //       });
  //     }
  //   }
  // });
};

// 搜索
const handleSearch = () => {
  console.log('搜索');
  // 跳转到搜索页面
  uni.navigateTo({
    url: '/pages/review/search'
  });
};

onMounted(() => {
  // 获取页面参数
  const query = uni.$route ? uni.$route.query : uni.getEnterOptionsSync().query;
  
  // 获取推荐菜列表数据
  getRecommendItems();
});

// 从store获取推荐菜列表数据
const getRecommendItems = () => {
  uni.showLoading({
    title: '加载中...'
  });
  
  coffeeShopStore.fetchRecommendItems()
    .then(() => {
      console.log('推荐菜单加载成功');
    })
    .catch(err => {
      console.error('获取推荐菜单失败:', err);
      uni.showToast({
        title: '获取推荐菜单失败',
        icon: 'none'
      });
    })
    .finally(() => {
      uni.hideLoading();
    });
};
</script>

<style lang="scss">
.recommend-list-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 30rpx;
}

.page-header {
  background-color: #fff;
  padding: 30rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .page-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333;
    }
    
    .search-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .icon {
        font-size: 40rpx;
        color: #333;
      }
    }
  }
}

.recommend-list {
  padding: 20rpx;
}

.recommend-item {
  display: flex;
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  position: relative;
  
  .top-tag {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #d84315;
    color: #fff;
    font-size: 24rpx;
    padding: 6rpx 12rpx;
    border-top-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    font-weight: bold;
    z-index: 1;
  }
  
  .item-image-container {
    width: 200rpx;
    height: 140rpx;
    position: relative;
    margin-right: 20rpx;
    
    .item-image {
      width: 100%;
      height: 100%;
      border-radius: 6rpx;
    }
  }
  
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .item-name {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 15rpx;
    }
    
    .item-price {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }
  }
  
  .add-btn {
    width: 60rpx;
    height: 60rpx;
    background-color: #f0f0f0;
    border-radius: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    
    .add-icon {
      font-size: 40rpx;
      color: #666;
    }
  }
}
</style> 