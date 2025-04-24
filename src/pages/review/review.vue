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
            <view class="stars">
              <text
                v-for="n in 5"
                :key="n"
                class="star"
                :class="
                  n <= Math.floor(item.rating)
                    ? 'filled'
                    : n - 0.5 <= item.rating
                    ? 'half'
                    : ''
                "
                >★</text
              > </view
            ><text class="rating">{{ item.rating }}</text
            ><text class="review-count">{{ item.reviewCount }}条</text
            ><text class="price">¥{{ item.price }}/人</text>
          </view>

          <!-- 评价内容 -->
          <view class="review-content" v-if="item.latestReview">
            <!-- 用户头像 -->
            <image
              :src="item.latestReview.user.avatar"
              class="reviewer-avatar"
            ></image>

            <!-- 评价文字 -->
            <text class="review-text">"{{ item.latestReview.content }}"</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 错误提示 -->
    <view class="error" v-if="error">
      <text>{{ error }}</text>
      <button @click="onPullDownRefresh">重试</button>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCoffeeShopStore } from "@/stores/coffeeShop";

const coffeeShopStore = useCoffeeShopStore();
const error = ref(null);

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

  .stars {
    display: flex;
    margin-right: 10rpx;
    flex-shrink: 0;

    .star {
      color: #ddd;
      font-size: 36rpx;
      line-height: 1;

      &.filled {
        color: #f76c3f;
      }

      &.half {
        position: relative;

        &:after {
          content: "★";
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
    font-size: 30rpx;
    color: #f76c3f;
    font-weight: bold;
    margin-right: 10rpx;
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
</style>
