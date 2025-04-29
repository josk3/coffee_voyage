<template>
  <view class="shop-detail">
    <!-- 轮播图 -->
    <swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(image, index) in coffeeShop.detail.images" :key="index">
        <image :src="image" mode="aspectFill"/>
      </swiper-item>
    </swiper>
    
    <!-- 店铺信息 -->
    <view class="shop-info">
      <view class="shop-name">{{ coffeeShop.detail.name }}</view>
      
      <!-- 评分区域 -->
      <view class="rating-container">
        <uni-rate 
          :value="coffeeShop.detail.rating" 
          :size="20" 
          :readonly="true" 
          :allow-half="true"
          active-color="#f76c3f"
          inactive-color="#ddd"
        />
        <text class="rating">{{ coffeeShop.detail.rating.toFixed(1) }}</text>
        <text class="review-count">{{ coffeeShop.detail.reviewCount }}条评价</text>
      </view>
      
      <!-- 店铺信息 -->
      <view class="info-item">
        <text class="label">地址：</text>
        <text class="value">{{ coffeeShop.detail.address }}</text>
      </view>
      
      <view class="info-item">
        <text class="label">电话：</text>
        <text class="value">{{ coffeeShop.detail.phone }}</text>
      </view>
      
      <view class="info-item">
        <text class="label">人均：</text>
        <text class="value">¥{{ coffeeShop.detail.price }}</text>
      </view>
    </view>
    
    <!-- 优惠信息 -->
    <view class="promotions" v-if="coffeeShop.detail.promotions && coffeeShop.detail.promotions.length">
      <view class="section-title">优惠信息</view>
      <view class="promotion-list">
        <view class="promotion-item" v-for="(item, index) in coffeeShop.detail.promotions" :key="index">
          <text class="type" :class="item.type">{{ item.type }}</text>
          <text class="description">{{ item.description }}</text>
        </view>
      </view>
    </view>
    
    <!-- 评价列表 -->
    <view class="reviews">
      <view class="section-title">用户评价</view>
      <view class="review-list">
        <view class="review-item" v-for="(item, index) in coffeeShop.reviews" :key="index">
          <view class="reviewer">
            <image :src="item.user.avatar" class="avatar"/>
            <view class="reviewer-info">
              <text class="name">{{ item.user.name }}</text>
              <view class="rating">
                <uni-rate 
                  :value="item.rating" 
                  :size="15" 
                  :readonly="true" 
                  :allow-half="false"
                  active-color="#f76c3f"
                  inactive-color="#ddd"
                />
              </view>
            </view>
            <text class="date">{{ item.date }}</text>
          </view>
          
          <text class="content">{{ item.content }}</text>
          
          <!-- 评价图片 -->
          <view class="review-images" v-if="item.images && item.images.length">
            <image 
              v-for="(image, imgIndex) in item.images" 
              :key="imgIndex"
              :src="image"
              mode="aspectFill"
              @click="previewImage(item.images, imgIndex)"
            />
          </view>
        </view>
      </view>
    </view>
    
    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore">
      <text v-if="loading">加载中...</text>
      <text v-else @click="loadMore">加载更多</text>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <button class="btn-review" @click="showReviewModal">写评价</button>
    </view>
    
    <!-- 评价弹窗 -->
    <uni-popup ref="reviewPopup" type="bottom">
      <view class="review-modal">
        <view class="modal-header">
          <text class="title">发表评价</text>
          <text class="close" @click="closeReviewModal">×</text>
        </view>
        
        <view class="modal-content">
          <view class="rating-section">
            <text class="label">评分：</text>
            <view class="stars">
              <text 
                v-for="n in 5" 
                :key="n" 
                class="star" 
                :class="n <= reviewForm.rating ? 'filled' : ''"
                @click="setRating(n)"
              >★</text>
            </view>
          </view>
          
          <view class="content-section">
            <textarea 
              v-model="reviewForm.content" 
              placeholder="请输入评价内容" 
              maxlength="500"
            />
            <text class="word-count">{{ reviewForm.content.length }}/500</text>
          </view>
          
          <view class="image-section">
            <view class="image-list">
              <view 
                class="image-item" 
                v-for="(image, index) in reviewForm.images" 
                :key="index"
              >
                <image :src="image" mode="aspectFill"/>
                <text class="delete" @click="deleteImage(index)">×</text>
              </view>
              <view class="upload-btn" @click="chooseImage" v-if="reviewForm.images.length < 9">
                <text class="icon">+</text>
                <text class="text">上传图片</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="btn-submit" @click="submitReview">提交评价</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import pageMixin from '@/mixins/page';
import uniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue';

export default {
  name: 'CoffeeShopDetail',
  mixins: [pageMixin],
  components: {
    uniRate
  },
  
  data() {
    return {
      shopId: '',
      reviewForm: {
        rating: 5,
        content: '',
        images: []
      }
    };
  },
  
  onLoad(options) {
    this.shopId = options.id;
    this.loadData();
    
    // 监听刷新店铺详情事件
    uni.$on('refreshShopDetail', this.handleRefreshShopDetail);
  },
  
  onUnload() {
    // 移除事件监听
    uni.$off('refreshShopDetail', this.handleRefreshShopDetail);
  },
  
  methods: {
    async loadData() {
      try {
        this.showLoading();
        await Promise.all([
          this.fetchCoffeeShopDetail(this.shopId),
          this.fetchCoffeeShopReviews({
            shopId: this.shopId,
            params: {
              page: this.page,
              limit: this.limit
            }
          })
        ]);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.hideLoading();
      }
    },
    
    // 预览图片
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      });
    },
    
    // 显示评价弹窗
    showReviewModal() {
      this.$refs.reviewPopup.open();
    },
    
    // 关闭评价弹窗
    closeReviewModal() {
      this.$refs.reviewPopup.close();
    },
    
    // 设置评分
    setRating(rating) {
      this.reviewForm.rating = rating;
    },
    
    // 选择图片
    async chooseImage() {
      try {
        const res = await uni.chooseImage({
          count: 9 - this.reviewForm.images.length,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        });
        
        this.reviewForm.images = [...this.reviewForm.images, ...res.tempFilePaths];
      } catch (error) {
        console.error('选择图片失败', error);
      }
    },
    
    // 删除图片
    deleteImage(index) {
      this.reviewForm.images.splice(index, 1);
    },
    
    // 提交评价
    async submitReview() {
      if (!this.reviewForm.content.trim()) {
        this.showError('请输入评价内容');
        return;
      }
      
      try {
        this.showLoading('提交中...');
        
        // 上传图片
        const uploadedImages = [];
        for (const image of this.reviewForm.images) {
          const uploadRes = await this.uploadImage(image);
          uploadedImages.push(uploadRes.url);
        }
        
        // 提交评价
        await this.addCoffeeShopReview(this.shopId, {
          rating: this.reviewForm.rating,
          content: this.reviewForm.content,
          images: uploadedImages
        });
        
        this.showSuccess('评价成功');
        this.closeReviewModal();
        this.resetReviewForm();
        this.onPullDownRefresh();
      } catch (error) {
        this.handleError(error);
      } finally {
        this.hideLoading();
      }
    },
    
    // 上传图片
    uploadImage(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${this.BASE_URL}/upload`,
          filePath,
          name: 'file',
          header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
          },
          success: (res) => {
            const data = JSON.parse(res.data);
            resolve(data);
          },
          fail: reject
        });
      });
    },
    
    // 重置评价表单
    resetReviewForm() {
      this.reviewForm = {
        rating: 5,
        content: '',
        images: []
      };
    },
    
    // 处理刷新店铺详情事件
    async handleRefreshShopDetail(data) {
      if (data.shopId === this.shopId) {
        try {
          this.showLoading();
          await Promise.all([
            this.fetchCoffeeShopDetail(this.shopId),
            this.fetchCoffeeShopReviews({
              shopId: this.shopId,
              params: {
                page: 1,
                limit: this.limit
              }
            })
          ]);
        } catch (error) {
          console.error('刷新店铺详情失败:', error);
        } finally {
          this.hideLoading();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shop-detail {
  padding-bottom: 100rpx;
  
  .banner {
    height: 400rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .shop-info {
    padding: 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    
    .shop-name {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .rating-container {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      .rating {
        font-size: 32rpx;
        color: #f76c3f;
        font-weight: bold;
        margin-right: 20rpx;
        margin-left: 10rpx;
      }
      
      .review-count {
        font-size: 28rpx;
        color: #666;
      }
    }
    
    .info-item {
      display: flex;
      margin-bottom: 10rpx;
      
      .label {
        width: 100rpx;
        color: #666;
      }
      
      .value {
        flex: 1;
        color: #333;
      }
    }
  }
  
  .promotions {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .promotion-list {
      .promotion-item {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .type {
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          border-radius: 6rpx;
          margin-right: 20rpx;
          font-size: 24rpx;
          color: #fff;
          
          &.券 {
            background: #f76c3f;
          }
          
          &.折 {
            background: #ff9500;
          }
        }
        
        .description {
          flex: 1;
          color: #333;
        }
      }
    }
  }
  
  .reviews {
    background: #fff;
    padding: 30rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .review-list {
      .review-item {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
        
        .reviewer {
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;
          
          .avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            margin-right: 20rpx;
          }
          
          .reviewer-info {
            flex: 1;
            
            .name {
              font-size: 28rpx;
              color: #333;
              margin-bottom: 10rpx;
            }
            
            .rating {
              display: flex;
            }
          }
          
          .date {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .content {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 20rpx;
        }
        
        .review-images {
          display: flex;
          flex-wrap: wrap;
          
          image {
            width: 200rpx;
            height: 200rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
            border-radius: 6rpx;
          }
        }
      }
    }
  }
  
  .load-more {
    text-align: center;
    padding: 20rpx;
    color: #999;
  }
  
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .btn-review {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: #f76c3f;
      color: #fff;
      border-radius: 40rpx;
      font-size: 32rpx;
    }
  }
  
  .review-modal {
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
      }
      
      .close {
        font-size: 40rpx;
        color: #999;
      }
    }
    
    .modal-content {
      padding: 30rpx;
      
      .rating-section {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
        
        .label {
          font-size: 28rpx;
          color: #333;
          margin-right: 20rpx;
        }
        
        .stars {
          display: flex;
          
          .star {
            font-size: 40rpx;
            color: #ddd;
            margin-right: 10rpx;
            
            &.filled {
              color: #f76c3f;
            }
          }
        }
      }
      
      .content-section {
        position: relative;
        margin-bottom: 30rpx;
        
        textarea {
          width: 100%;
          height: 200rpx;
          padding: 20rpx;
          border: 1rpx solid #eee;
          border-radius: 10rpx;
          font-size: 28rpx;
        }
        
        .word-count {
          position: absolute;
          right: 20rpx;
          bottom: 20rpx;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .image-section {
        .image-list {
          display: flex;
          flex-wrap: wrap;
          
          .image-item {
            position: relative;
            width: 200rpx;
            height: 200rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
            
            image {
              width: 100%;
              height: 100%;
              border-radius: 6rpx;
            }
            
            .delete {
              position: absolute;
              right: 10rpx;
              top: 10rpx;
              width: 40rpx;
              height: 40rpx;
              line-height: 40rpx;
              text-align: center;
              background: rgba(0, 0, 0, 0.5);
              color: #fff;
              border-radius: 50%;
            }
          }
          
          .upload-btn {
            width: 200rpx;
            height: 200rpx;
            border: 1rpx dashed #ddd;
            border-radius: 6rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            
            .icon {
              font-size: 60rpx;
              color: #999;
              margin-bottom: 10rpx;
            }
            
            .text {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
    
    .modal-footer {
      padding: 30rpx;
      border-top: 1rpx solid #eee;
      
      .btn-submit {
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background: #f76c3f;
        color: #fff;
        border-radius: 40rpx;
        font-size: 32rpx;
      }
    }
  }
}
</style> 