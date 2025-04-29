<template>
  <view class="recommend-list-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">网友推荐菜 ({{ totalCount }})</text>
        <!-- 添加新增按钮 -->
        <view class="header-actions">
          <view class="add-icon" @click="showAddForm">
            <uni-icons type="plusempty" size="24" color="#f76c3f"></uni-icons>
          </view>
          <view class="search-icon" @click="handleSearch">
            <uni-icons type="search" size="24" color="#333"></uni-icons>
          </view>
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
          <uni-icons type="plusempty" size="20" color="#666"></uni-icons>
        </view>
      </view>
    </view>
    
    <!-- 新增推荐菜弹出层 -->
    <view class="add-form-popup" v-if="showAddFormPopup">
      <view class="popup-mask" @click="hideAddForm"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">添加推荐菜</text>
          <view class="popup-close" @click="hideAddForm">
            <uni-icons type="close" size="20" color="#666"></uni-icons>
          </view>
        </view>
        
        <scroll-view class="popup-body" scroll-y>
          <view class="form-item">
            <text class="form-label">菜品名称 <text class="required">*</text></text>
            <input type="text" v-model="newDish.name" placeholder="请输入菜品名称" class="form-input" />
          </view>
          
          <view class="form-item">
            <text class="form-label">菜品图片URL <text class="required">*</text></text>
            <input type="text" v-model="newDish.image" placeholder="请输入图片URL" class="form-input" />
          </view>
          
          <view class="form-item">
            <text class="form-label">菜品价格 <text class="required">*</text></text>
            <input type="number" v-model="newDish.price" placeholder="请输入价格" class="form-input" />
          </view>
          
          <view class="form-item">
            <text class="form-label">推荐指数</text>
            <slider :value="newDish.recommendIndex" min="1" max="5" show-value class="form-slider" @change="e => newDish.recommendIndex = e.detail.value" />
          </view>
          
          <view class="form-item">
            <text class="form-label">菜品描述</text>
            <textarea v-model="newDish.description" placeholder="请输入菜品描述" class="form-textarea"></textarea>
          </view>
          
          <button class="submit-btn" @click="submitNewDish" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '提交' }}
          </button>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCoffeeShopStore } from '@/stores/coffeeShop';

// 引入uni-icons组件
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

// 获取store
const coffeeShopStore = useCoffeeShopStore();

// 推荐菜总数
const totalCount = computed(() => {
  return coffeeShopStore.recommendItems.length;
});

// 推荐菜数据，直接从store获取
const recommendItems = computed(() => coffeeShopStore.recommendItems);

// 获取当前咖啡店ID参数
const shopId = ref('');

// 控制新增表单弹出层
const showAddFormPopup = ref(false);

// 新推荐菜表单数据
const newDish = ref({
  name: '',
  image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
  price: 0,
  recommendIndex: 5,
  description: ''
});

// 提交状态
const isSubmitting = ref(false);

// 显示新增表单
const showAddForm = () => {
  showAddFormPopup.value = true;
};

// 隐藏新增表单
const hideAddForm = () => {
  showAddFormPopup.value = false;
};

// 重置表单
const resetForm = () => {
  newDish.value = {
    name: '',
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    price: 0,
    recommendIndex: 5,
    description: ''
  };
};

// 提交新推荐菜
const submitNewDish = () => {
  // 表单验证
  if (!newDish.value.name.trim()) {
    uni.showToast({
      title: '请输入菜品名称',
      icon: 'none'
    });
    return;
  }
  
  if (!newDish.value.image.trim()) {
    uni.showToast({
      title: '请输入菜品图片URL',
      icon: 'none'
    });
    return;
  }
  
  if (!newDish.value.price || Number(newDish.value.price) <= 0) {
    uni.showToast({
      title: '请输入有效的菜品价格',
      icon: 'none'
    });
    return;
  }
  
  // 设置提交中状态
  isSubmitting.value = true;
  
  // 构建请求数据
  const requestData = {
    dishName: newDish.value.name,
    dishImage: newDish.value.image,
    price: Number(newDish.value.price),
    recommendIndex: Number(newDish.value.recommendIndex),
    description: newDish.value.description
  };
  
  // 调用store中的方法提交新推荐菜
  coffeeShopStore.addRecommendedDish(shopId.value, requestData)
    .then(() => {
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      });
      
      // 隐藏表单并重置
      hideAddForm();
      resetForm();
    })
    .catch(err => {
      uni.showToast({
        title: err.message || '添加失败',
        icon: 'none'
      });
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

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
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage && currentPage.options) {
    shopId.value = currentPage.options.shopId || '';
    
    if (shopId.value) {
      // 获取推荐菜列表数据
      getRecommendItems(shopId.value);
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
  }
});

// 从store获取推荐菜列表数据
const getRecommendItems = (id) => {
  if (!id) {
    uni.showToast({
      title: '缺少商店ID',
      icon: 'none'
    });
    return;
  }
  
  uni.showLoading({
    title: '加载中...'
  });
  
  coffeeShopStore.fetchRecommendItems(id)
    .then(() => {
      console.log(`咖啡店(${id})推荐菜单加载成功`);
    })
    .catch(err => {
      console.error(`获取咖啡店(${id})推荐菜单失败:`, err);
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
    
    .header-actions {
      display: flex;
      align-items: center;
    }
    
    .search-icon, .add-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
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
  }
}

/* 新增表单弹出层样式 */
.add-form-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  
  .popup-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  
  .popup-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 30rpx 30rpx 0 0;
    padding-bottom: 50rpx;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;
      
      .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .popup-close {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    
    .popup-body {
      flex: 1;
      padding: 30rpx;
      max-height: calc(80vh - 100rpx);
    }
  }
}

/* 表单样式 */
.form-item {
  margin-bottom: 30rpx;
  
  .form-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
    
    .required {
      color: #f76c3f;
      margin-left: 4rpx;
    }
  }
  
  .form-input {
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }
  
  .form-textarea {
    width: 100%;
    height: 160rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }
  
  .form-slider {
    margin-top: 10rpx;
  }
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  background-color: #f76c3f;
  color: #fff;
  font-size: 30rpx;
  border-radius: 8rpx;
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:disabled {
    opacity: 0.7;
  }
}
</style> 