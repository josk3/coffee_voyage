<template>
  <view class="write-review-container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="left" @click="handleCancel">取消</view>
      <view class="title">瑞幸咖啡 {{ shopAddress }}</view>
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

// 店铺信息
const shopName = ref('瑞幸咖啡');
const shopId = ref(0);
const shopAddress = ref('');

// 评价内容
const reviewText = ref('');
const uploadedImages = ref([]);
const isAnonymous = ref(false);

// 判断是否可以发布
const canPublish = computed(() => {
  return reviewText.value.trim().length > 0;
});

// 检查是否可以发布
const checkCanPublish = () => {
  // 这里可以添加更复杂的验证逻辑
  console.log('检查是否可以发布:', canPublish.value);
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
    }
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
  
  // 显示加载中
  uni.showLoading({
    title: '发布中...'
  });
  
  // 模拟提交数据
  setTimeout(() => {
    // 隐藏加载
    uni.hideLoading();
    
    // 提交成功提示
    uni.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 2000
    });
    
    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      });
    }, 1500);
  }, 1500);
};

onMounted(() => {
  // 获取页面参数
  const query = uni.$route ? uni.$route.query : uni.getEnterOptionsSync().query;
  shopId.value = query.shopId || 0;
  shopName.value = query.shopName || '瑞幸咖啡';
  shopAddress.value = query.shopAddress || '';
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