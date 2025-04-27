<template>
  <view class="review-container">
    <!-- 评价列表 -->
    <view class="coffee-list">
      <view
        class="coffee-item"
        v-for="(item, index) in coffeeShops"
        :key="index"
        @click="handleShopClick(item)"
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
            <uni-rate 
              :value="item.rating" 
              :size="18" 
              :readonly="true" 
              :allow-half="true"
              active-color="#f76c3f"
              inactive-color="#ddd"
            />
            <text class="rating">{{ item.rating.toFixed(1) }}</text
            ><text class="review-count">{{ item.reviewCount }}条</text
            ><text class="price">¥{{ item.price }}/人</text>
          </view>

          <!-- 评价内容 -->
          <view class="review-content" v-if="item.reviewer">
            <!-- 用户头像 -->
            <image
              :src="item.reviewer.avatar"
              class="reviewer-avatar"
            ></image>

            <!-- 评价文字 -->
            <text class="review-text">"{{ item.reviewer.reviewText }}"</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 错误提示 -->
    <view class="error" v-if="error">
      <text>{{ error }}</text>
      <button @click="onPullDownRefresh">重试</button>
    </view>
    
    <!-- 管理按钮 -->
    <view class="admin-button" @click="showAdminPopup">
      <uni-icons type="settings" size="24" color="#fff"></uni-icons>
      <text>管理</text>
    </view>
    
    <!-- 管理弹窗 -->
    <view class="admin-popup" v-if="showPopup">
      <view class="popup-mask" @click="hideAdminPopup"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">后台管理</text>
          <view class="popup-close" @click="hideAdminPopup">
            <uni-icons type="close" size="20" color="#666"></uni-icons>
          </view>
        </view>
        
        <scroll-view class="popup-body" scroll-y>
          <view class="form-section">
            <view class="section-title">添加咖啡店</view>
            
            <view class="form-item">
              <text class="form-label">店铺名称</text>
              <input type="text" v-model="formData.name" placeholder="请输入店铺名称" class="form-input" />
            </view>
            
            <view class="form-item">
              <text class="form-label">图片URL</text>
              <input type="text" v-model="formData.logo" placeholder="请输入图片URL" class="form-input" />
            </view>
            
            <view class="form-item">
              <text class="form-label">评分</text>
              <input type="number" v-model="formData.rating" placeholder="评分(1-5)" class="form-input" />
            </view>
            
            <view class="form-item">
              <text class="form-label">评价数</text>
              <input type="number" v-model="formData.reviewCount" placeholder="评价数量" class="form-input" />
            </view>
            
            <view class="form-item">
              <text class="form-label">人均价格</text>
              <input type="number" v-model="formData.price" placeholder="人均价格" class="form-input" />
            </view>
            
            <view class="form-section">
              <view class="section-title">示例评价</view>
              
              <view class="form-item">
                <text class="form-label">用户姓名</text>
                <input type="text" v-model="formData.reviewerName" placeholder="请输入用户姓名" class="form-input" />
              </view>
              
              <view class="form-item">
                <text class="form-label">评价者头像</text>
                <input type="text" v-model="formData.reviewerAvatar" placeholder="头像URL" class="form-input" />
              </view>
              
              <view class="form-item">
                <text class="form-label">评价内容</text>
                <textarea v-model="formData.reviewText" placeholder="评价内容" class="form-textarea"></textarea>
              </view>
            </view>
            
            <view class="form-section">
              <view class="section-title">推荐菜品</view>
              
              <view class="form-item">
                <text class="form-label">菜品名称</text>
                <input type="text" v-model="formData.dishName" placeholder="请输入菜品名称" class="form-input" />
              </view>
              
              <view class="form-item">
                <text class="form-label">菜品图片</text>
                <input type="text" v-model="formData.dishImage" placeholder="图片URL" class="form-input" />
              </view>
              
              <view class="form-item">
                <text class="form-label">菜品价格</text>
                <input type="number" v-model="formData.dishPrice" placeholder="请输入价格" class="form-input" />
              </view>
              
              <view class="form-item">
                <text class="form-label">推荐指数</text>
                <view class="rating-picker">
                  <uni-rate v-model="formData.dishRating" :size="24" :value="formData.dishRating" :max="5"></uni-rate>
                  <text class="rating-value">{{ formData.dishRating }}星</text>
                </view>
              </view>
              
              <view class="form-item">
                <text class="form-label">菜品描述</text>
                <textarea v-model="formData.dishDescription" placeholder="请输入菜品描述" class="form-textarea"></textarea>
              </view>
            </view>
            
            <button class="submit-btn" @click="handleSubmit">提交</button>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCoffeeShopStore } from "@/stores/coffeeShop";
import uniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const coffeeShopStore = useCoffeeShopStore();
const error = ref(null);

// 弹窗相关状态
const showPopup = ref(false);
const formData = ref({
  name: '',
  logo: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
  rating: 4.5,
  reviewCount: 0,
  price: 30,
  reviewerName: '',
  reviewerAvatar: 'https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp',
  reviewText: '',
  dishName: '',
  dishImage: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
  dishPrice: 0,
  dishRating: 5,
  dishDescription: ''
});

// 显示管理弹窗
function showAdminPopup() {
  showPopup.value = true;
}

// 隐藏管理弹窗
function hideAdminPopup() {
  showPopup.value = false;
}

// 提交表单
function handleSubmit() {
  console.log('提交表单数据:', formData.value);
  
  // 这里先用占位处理
  uni.showToast({
    title: '提交成功',
    icon: 'success'
  });
  
  // 重置表单
  formData.value = {
    name: '',
    logo: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    rating: 4.5,
    reviewCount: 0,
    price: 30,
    reviewerName: '',
    reviewerAvatar: 'https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp',
    reviewText: '',
    dishName: '',
    dishImage: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
    dishPrice: 0,
    dishRating: 5,
    dishDescription: ''
  };
  
  // 关闭弹窗
  hideAdminPopup();
}

coffeeShopStore.fetchCoffeeShopList();

function handleShopClick(item) {
  if (item && item._id) {
    console.log('点击咖啡店项目:', item.name, '- ID:', item._id);
    
    // 先跳转到详情页，而不是等待数据加载
    uni.navigateTo({
      url: `/pages/review/detail?id=${item._id}`,
    });
    
    // 在后台预加载数据
    coffeeShopStore.fetchCoffeeShopDetail(item._id)
      .then(data => {
        console.log('预加载咖啡店详情成功:', data ? data.name : 'undefined');
      })
      .catch(err => {
        console.error('预加载咖啡店详情失败:', err);
        // 不显示错误提示，因为用户已经跳转到了详情页
      });
  } else {
    uni.showToast({
      title: '商店信息不完整',
      icon: 'none'
    });
  }
}

function onPullDownRefresh() {
  coffeeShopStore.fetchCoffeeShopList();
}

const coffeeShops = ref(coffeeShopStore.list);

watch(
  () => coffeeShopStore.list,
  (newList) => {
    coffeeShops.value = newList;
  }
);
</script>

<style lang="scss" scoped>
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
  flex-wrap: nowrap;

  .rating {
    font-size: 30rpx;
    color: #f76c3f;
    font-weight: bold;
    margin-right: 10rpx;
    margin-left: 10rpx;
    flex-shrink: 0;
  }

  .review-count {
    font-size: 26rpx;
    color: #666;
    margin-right: 10rpx;
    margin-left: 10rpx;
    flex-shrink: 0;
  }

  .price {
    font-size: 26rpx;
    color: #666;
    flex-shrink: 0;
    margin-left: 10rpx;
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

.error {
  text-align: center;
  padding: 20rpx;

  text {
    color: #999;
  }

  button {
    margin-top: 20rpx;
  }
}

// 管理按钮样式
.admin-button {
  position: fixed;
  right: 30rpx;
  bottom: 80rpx;
  background-color: #f76c3f;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(247, 108, 63, 0.4);
  z-index: 100;
  
  text {
    font-size: 24rpx;
    color: #fff;
    margin-top: 6rpx;
  }
}

// 弹窗样式
.admin-popup {
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
        padding: 10rpx;
      }
    }
    
    .popup-body {
      flex: 1;
      padding: 30rpx;
      max-height: calc(80vh - 100rpx);
    }
  }
}

// 表单样式
.form-section {
  margin-bottom: 40rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    border-left: 6rpx solid #f76c3f;
    padding-left: 15rpx;
  }
}

.form-item {
  margin-bottom: 20rpx;
  
  .form-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .rating-picker {
    display: flex;
    align-items: center;
    
    .rating-value {
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #f76c3f;
    }
  }
  
  .form-input {
    width: 92%;
    height: 80rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }
  
  .form-textarea {
    width: 92%;
    height: 160rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
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
}
</style>
