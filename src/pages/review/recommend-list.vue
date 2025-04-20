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
          
          <!-- 上传图片提示 -->
          <view class="upload-hint" v-if="item.canUpload" @click.stop="uploadImage(item)">
            <view class="upload-icon">📷</view>
            <view class="upload-text">传首图赢{{ item.points }}积分 ></view>
          </view>
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
    
    <!-- 促销信息 -->
    <view class="promotion-bar" @click="viewPromotion">
      <view class="promotion-tag">团</view>
      <view class="promotion-text">10.9元【瑞】特惠丨爆款甄选12选1</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 推荐菜总数
const totalCount = computed(() => {
  return recommendItems.value.length;
});

// 推荐菜数据
const recommendItems = ref([
  {
    id: 1,
    name: '冰吸生椰拿铁',
    price: 32,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: true,
    points: 20
  },
  {
    id: 2,
    name: '陨石拿铁',
    price: 32,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: true,
    points: 20
  },
  {
    id: 3,
    name: '生椰丝绒拿铁',
    price: 35,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: false
  },
  {
    id: 4,
    name: '冰镇杨梅瑞纳冰',
    price: 38,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: true,
    points: 20
  },
  {
    id: 5,
    name: '小黄油拿铁',
    price: 25,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: false
  },
  {
    id: 6,
    name: '太妃榛香拿铁',
    price: 28,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: false
  },
  {
    id: 7,
    name: '费尔岛拿铁',
    price: 30,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: false
  },
  {
    id: 8,
    name: '西梅拿铁',
    price: 26,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    canUpload: false
  }
]);

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

// 上传图片
const uploadImage = (item) => {
  console.log('上传图片:', item.name);
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      console.log('选择的图片:', res.tempFilePaths[0]);
      uni.showToast({
        title: '上传成功，积分已入账',
        icon: 'success'
      });
      
      // 实际逻辑：上传图片到服务器
      // const uploadTask = uni.uploadFile({
      //   url: 'https://api.example.com/upload',
      //   filePath: res.tempFilePaths[0],
      //   name: 'file',
      //   formData: {
      //     'productId': item.id
      //   },
      //   success: (res) => {
      //     const data = JSON.parse(res.data);
      //     if (data.success) {
      //       uni.showToast({
      //         title: '上传成功，积分已入账',
      //         icon: 'success'
      //       });
      //     }
      //   }
      // });
    }
  });
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

// 查看促销活动
const viewPromotion = () => {
  console.log('查看促销活动');
  uni.showToast({
    title: '查看促销活动详情',
    icon: 'none'
  });
};

onMounted(() => {
  // 获取页面参数
  const query = uni.$route ? uni.$route.query : uni.getEnterOptionsSync().query;
  
  // 获取推荐菜列表数据
  // 这里可以添加从服务器获取数据的逻辑
  // getRecommendItems(query.shopId);
});

// 从后端获取推荐菜列表数据
const getRecommendItems = (shopId) => {
  // 实际逻辑：从后端获取推荐菜列表
  // uni.request({
  //   url: `https://api.example.com/shop/${shopId}/recommends`,
  //   method: 'GET',
  //   success: (res) => {
  //     if (res.data.success) {
  //       recommendItems.value = res.data.items;
  //       totalCount.value = res.data.total;
  //     }
  //   }
  // });
};
</script>

<style lang="scss">
.recommend-list-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 100rpx;
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
    
    .upload-hint {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 6rpx 10rpx;
      font-size: 22rpx;
      display: flex;
      align-items: center;
      
      .upload-icon {
        margin-right: 6rpx;
      }
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

.promotion-bar {
  position: fixed;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 30rpx;
  padding: 15rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .promotion-tag {
    width: 40rpx;
    height: 40rpx;
    background-color: #ff6f00;
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6rpx;
    margin-right: 10rpx;
  }
  
  .promotion-text {
    font-size: 28rpx;
    color: #333;
  }
}
</style> 