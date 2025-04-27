<template>
  <view class="write-review-container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="left" @click="handleCancel">取消</view>
      <view class="title">{{ shopName }}</view>
      <view class="right" @click="handlePublish" :class="{ 'active': canPublish }">发布</view>
    </view>
    
    <!-- 大家都在问提示区域 -->
    <view class="question-hint">
      <text class="hint-text">大家都在问：口味怎么样，咖啡豆如何，制作出品怎么样，环境（空间、布置）怎么样，服务态度好吗？</text>
    </view>
    
    <!-- 评价内容输入框 -->
    <view class="review-content">
      <textarea 
        class="review-textarea" 
        v-model="reviewText" 
        placeholder="写下你的感受和建议，帮助其他小伙伴了解" 
        placeholder-class="placeholder"
        maxlength="500"
        @input="checkCanPublish"
      ></textarea>
      
      <!-- 图片上传区域 -->
      <view class="upload-area">
        <view class="image-list">
          <!-- 已上传的图片 -->
          <view 
            class="image-item" 
            v-for="(img, index) in uploadedImages" 
            :key="index"
          >
            <image :src="img" mode="aspectFill" class="preview-image"></image>
            <view class="delete-btn" @click="deleteImage(index)">×</view>
          </view>
          
          <!-- 上传按钮 -->
          <view class="upload-btn" @click="chooseImage" v-if="uploadedImages.length < 9">
            <view class="icon-wrapper">
              <text class="upload-icon">+</text>
            </view>
            <text class="upload-text">上传照片</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 匿名评价选项 -->
    <view class="anonymous-option">
      <view class="option-left">
        <text class="option-text">匿名评价</text>
        <text class="option-desc">隐藏你的头像和昵称</text>
      </view>
      <switch 
        :checked="isAnonymous" 
        @change="handleAnonymousChange" 
        color="#f76c3f"
        class="anonymous-switch"
      />
    </view>
    
    <!-- 底部提交按钮（移动端可用） -->
    <view class="submit-btn" :class="{ 'active': canPublish }" @click="handlePublish">
      发布
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { addCoffeeShopReview } from '@/api/coffeeShop';

// 店铺信息
const shopName = ref('');
const shopId = ref('');

// 评价内容
const reviewText = ref('');
const uploadedImages = ref([]);
const isAnonymous = ref(false);
const rating = ref(5); // 默认评分为5星
const userInfo = ref(null); // 用户信息

// API基础URL
const baseUrl = 'http://localhost:3000/api';

// 上传中图片的数量
const uploadingCount = ref(0);

// 判断是否可以发布
const canPublish = computed(() => {
  return reviewText.value.trim().length > 0;
});

// 检查是否可以发布
const checkCanPublish = () => {
  // 这里可以添加更复杂的验证逻辑
};

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - uploadedImages.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 将选择的图片添加到已上传列表中
      uploadedImages.value = [...uploadedImages.value, ...res.tempFilePaths];
      
      // 实际应用中应该上传图片到服务器
      uploadImages(res.tempFilePaths);
    }
  });
};

// 上传图片到服务器
const uploadImages = (imagePaths) => {
  // 增加上传中计数
  uploadingCount.value += imagePaths.length;
  
  // 显示上传中提示
  uni.showLoading({
    title: '上传中...',
    mask: true
  });
  
  // 遍历图片路径进行上传
  const uploadPromises = imagePaths.map(path => {
    return new Promise((resolve, reject) => {
      // 模拟上传成功
      setTimeout(() => {
        // 实际项目中应该替换为真实的图片上传API
        resolve({ 
          path, 
          success: true, 
          url: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg' 
        });
      }, 1000);
    });
  });
  
  // 等待所有图片上传完成
  Promise.allSettled(uploadPromises).then(results => {
    // 减少上传中计数
    uploadingCount.value -= imagePaths.length;
    
    // 隐藏加载提示
    if (uploadingCount.value === 0) {
      uni.hideLoading();
    }
    
    // 处理上传结果
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        // 上传成功的处理
        const index = uploadedImages.value.findIndex(img => img === result.value.path);
        if (index !== -1) {
          uploadedImages.value[index] = result.value.url;
        }
      } else {
        // 上传失败的处理
        uni.showToast({
          title: result.reason?.message || '图片上传失败',
          icon: 'none'
        });
      }
    });
  });
};

// 删除图片
const deleteImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

// 切换匿名状态
const handleAnonymousChange = (e) => {
  isAnonymous.value = e.detail.value;
};

// 取消评价
const handleCancel = () => {
  uni.showModal({
    title: '提示',
    content: '是否放弃此次评价？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack();
      }
    }
  });
};

// 发布评价
const handlePublish = () => {
  if (!canPublish.value) {
    uni.showToast({
      title: '请输入评价内容',
      icon: 'none'
    });
    return;
  }
  
  // 如果有图片正在上传，提示等待
  if (uploadingCount.value > 0) {
    uni.showToast({
      title: '图片上传中，请稍候',
      icon: 'none'
    });
    return;
  }
  
  // 获取用户信息
  const savedUserInfo = uni.getStorageSync('userInfo');
  if (!savedUserInfo || !savedUserInfo.nickName || !savedUserInfo.avatarUrl) {
    
    uni.showModal({
      title: '提示',
      content: '需要提供用户信息才能发表评论',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          // 跳转到登录页面
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
    return;
  }
  
  // 准备提交的数据，按照API文档要求
  const reviewData = {
    userName: isAnonymous.value ? "匿名用户" : savedUserInfo.nickName,
    userAvatar: isAnonymous.value ? "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0" : savedUserInfo.avatarUrl,
    content: reviewText.value,
    rating: 5, // 明确设置为数字5
    images: uploadedImages.value
  };
  
  console.log('准备提交评价数据:', JSON.stringify(reviewData));
  
  // 显示加载状态
  uni.showLoading({
    title: '提交中...',
    mask: true
  });
  
  // 使用封装好的API提交评价
  addCoffeeShopReview(shopId.value, reviewData)
    .then(res => {
      console.log('评价提交响应:', res);
      
      // 发送全局事件通知详情页刷新数据
      uni.$emit('refreshShopDetail', {
        shopId: shopId.value,
        timestamp: Date.now()
      });
      
      // 提示成功
      uni.showToast({
        title: '评价发布成功',
        icon: 'success'
      });
      
      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    })
    .catch(err => {
      console.error('评价提交失败:', err);
      
      // 显示错误信息
      uni.showToast({
        title: err.message || '评价发布失败，请稍后重试',
        icon: 'none'
      });
    })
    .finally(() => {
      uni.hideLoading();
    });
};

onMounted(() => {
  // 从全局数据获取商店信息
  const app = getApp();
  if (app.globalData && app.globalData.shopInfo) {
    shopId.value = app.globalData.shopInfo.id;
    shopName.value = app.globalData.shopInfo.name;
  } else {
    uni.showToast({
      title: '数据获取失败',
      icon: 'none'
    });
    
    // 如果没有数据则返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
  
  // 获取用户信息
  userInfo.value = uni.getStorageSync('userInfo');
});
</script>

<style lang="scss">
.write-review-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  background-color: #fff;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  
  .left, .right {
    font-size: 32rpx;
    padding: 10rpx;
  }
  
  .left {
    color: #333;
  }
  
  .right {
    color: #ccc;
    
    &.active {
      color: #f76c3f;
    }
  }
  
  .title {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.question-hint {
  background-color: #fff;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  
  .hint-text {
    font-size: 28rpx;
    color: #999;
    line-height: 1.5;
  }
}

.review-content {
  background-color: #fff;
  padding: 30rpx;
  
  .review-textarea {
    width: 100%;
    height: 240rpx;
    font-size: 30rpx;
    line-height: 1.6;
    color: #333;
    padding: 0;
  }
  
  .placeholder {
    color: #999;
  }
  
  .upload-area {
    margin-top: 30rpx;
    
    .image-list {
      display: flex;
      flex-wrap: wrap;
      
      .image-item {
        width: 210rpx;
        height: 210rpx;
        margin-right: 15rpx;
        margin-bottom: 15rpx;
        position: relative;
        
        .preview-image {
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
        
        .delete-btn {
          position: absolute;
          top: -20rpx;
          right: -20rpx;
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32rpx;
        }
      }
      
      .upload-btn {
        width: 210rpx;
        height: 210rpx;
        border: 2rpx dashed #ddd;
        border-radius: 8rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        .icon-wrapper {
          width: 70rpx;
          height: 70rpx;
          background-color: #f0f0f0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10rpx;
          
          .upload-icon {
            font-size: 40rpx;
            color: #999;
          }
        }
        
        .upload-text {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
  }
}

.anonymous-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  
  .option-left {
    .option-text {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .option-desc {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .anonymous-switch {
    transform: scale(0.8);
  }
}

.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #cccccc;
  color: #fff;
  font-size: 34rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &.active {
    background-color: #f76c3f;
  }
}
</style> 