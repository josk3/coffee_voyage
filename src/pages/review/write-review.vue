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

// 店铺信息
const shopName = ref('');
const shopId = ref('');
const shopAddress = ref('');

// 评价内容
const reviewText = ref('');
const uploadedImages = ref([]);
const isAnonymous = ref(false);

// 上传中图片的数量
const uploadingCount = ref(0);

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
      console.log('选择图片成功:', res.tempFilePaths);
      // 将选择的图片添加到已上传列表中
      uploadedImages.value = [...uploadedImages.value, ...res.tempFilePaths];
      
      // 实际应用中应该上传图片到服务器
      // uploadImages(res.tempFilePaths);
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
        resolve({ path, success: true, url: path });
      }, 1000);
      
      // 实际接口调用
      // uni.uploadFile({
      //   url: 'https://api.example.com/upload/image',
      //   filePath: path,
      //   name: 'file',
      //   formData: {
      //     'shopId': shopId.value,
      //     'type': 'review'
      //   },
      //   success: (res) => {
      //     const data = JSON.parse(res.data);
      //     if (data.success) {
      //       resolve({
      //         path,
      //         success: true,
      //         url: data.url // 服务器返回的图片URL
      //       });
      //     } else {
      //       reject({
      //         path,
      //         success: false,
      //         message: data.message || '上传失败'
      //       });
      //     }
      //   },
      //   fail: (err) => {
      //     reject({
      //       path,
      //       success: false,
      //       message: '网络错误'
      //     });
      //   }
      // });
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
        console.log('图片上传成功:', result.value.url);
        // 实际应用中替换本地路径为服务器URL
        // const index = uploadedImages.value.findIndex(img => img === result.value.path);
        // if (index !== -1) {
        //   uploadedImages.value[index] = result.value.url;
        // }
      } else {
        // 上传失败的处理
        console.error('图片上传失败:', result.reason?.message || '未知错误');
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
  
  // 展示提交中加载框
  uni.showLoading({
    title: '发布中...',
    mask: true
  });
  
  // 准备提交的数据
  const reviewData = {
    shopId: shopId.value,
    content: reviewText.value,
    isAnonymous: isAnonymous.value,
    images: uploadedImages.value
  };
  
  console.log('提交的评价数据:', reviewData);
  
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
        delta: 1,
        success: () => {
          // 可以通过事件总线或全局状态更新上一页的评价列表
          // 例如: uni.$emit('reviewAdded', reviewData);
        }
      });
    }, 1500);
  }, 1500);
  
  // 实际接口调用
  // uni.request({
  //   url: 'https://api.example.com/review/submit',
  //   method: 'POST',
  //   data: reviewData,
  //   success: (res) => {
  //     uni.hideLoading();
  //     
  //     if (res.data.success) {
  //       // 提交成功
  //       uni.showToast({
  //         title: '发布成功',
  //         icon: 'success',
  //         duration: 2000
  //       });
  //       
  //       // 延迟返回上一页
  //       setTimeout(() => {
  //         uni.navigateBack({
  //           delta: 1,
  //           success: () => {
  //             // 可以通过事件总线或全局状态更新上一页的评价列表
  //             // 例如: uni.$emit('reviewAdded', reviewData);
  //           }
  //         });
  //       }, 1500);
  //     } else {
  //       // 提交失败
  //       uni.showToast({
  //         title: res.data.message || '发布失败，请重试',
  //         icon: 'none'
  //       });
  //     }
  //   },
  //   fail: () => {
  //     uni.hideLoading();
  //     uni.showToast({
  //       title: '网络错误，请重试',
  //       icon: 'none'
  //     });
  //   }
  // });
};

onMounted(() => {
  console.log('写评价页面已加载');
  
  // 获取页面参数
  const query = uni.$route ? uni.$route.query : uni.getEnterOptionsSync().query;
  console.log('页面参数:', query);
  
  // 首先尝试从全局数据获取店铺信息
  const app = getApp();
  if (app.globalData && app.globalData.shopInfo) {
    console.log('从全局数据获取店铺信息:', app.globalData.shopInfo);
    shopId.value = app.globalData.shopInfo.id;
    shopName.value = app.globalData.shopInfo.name;
    shopAddress.value = app.globalData.shopInfo.address;
  } 
  // 如果全局数据中没有，尝试从URL参数获取
  else if (query) {
    // 获取店铺ID
    if (query.shopId) {
      shopId.value = query.shopId;
    }
    
    // 获取店铺名称，URL解码
    if (query.shopName) {
      try {
        shopName.value = decodeURIComponent(query.shopName);
        console.log('解码后的店铺名称:', shopName.value);
      } catch (e) {
        // 如果解码失败，直接使用原始值
        shopName.value = query.shopName;
        console.error('店铺名称解码失败:', e);
      }
    }
    
    // 获取店铺地址，URL解码
    if (query.shopAddress) {
      try {
        shopAddress.value = decodeURIComponent(query.shopAddress);
      } catch (e) {
        shopAddress.value = query.shopAddress;
        console.error('店铺地址解码失败:', e);
      }
    }
  }
  
  // 如果没有获取到店铺名称，设置默认值
  if (!shopName.value) {
    shopName.value = '咖啡店';
  }
  
  console.log('当前店铺:', shopName.value, '店铺ID:', shopId.value);
  
  // 可以在这里获取用户信息等
  // getUserInfo();
});

// 获取用户信息
const getUserInfo = () => {
  // 实际接口调用
  // uni.request({
  //   url: 'https://api.example.com/user/info',
  //   method: 'GET',
  //   success: (res) => {
  //     if (res.data.success) {
  //       // 可以根据用户信息来处理界面显示
  //       console.log('用户信息:', res.data.user);
  //     }
  //   }
  // });
};
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