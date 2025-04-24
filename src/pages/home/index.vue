<template>
  <view class="home">
    <!-- 轮播图 -->
    <swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item, index) in home.banners" :key="index">
        <image :src="item.imageUrl" mode="aspectFill" @click="handleBannerClick(item)"/>
      </swiper-item>
    </swiper>
    
    <!-- 推荐分类 -->
    <view class="section">
      <view class="section-title">推荐分类</view>
      <view class="category-list">
        <view 
          class="category-item" 
          v-for="(item, index) in home.featuredCategories" 
          :key="index"
          @click="handleCategoryClick(item)"
        >
          <image :src="item.iconUrl" mode="aspectFit"/>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 推荐专辑 -->
    <view class="section">
      <view class="section-title">推荐专辑</view>
      <view class="album-list">
        <view 
          class="album-item" 
          v-for="(item, index) in home.featuredAlbums" 
          :key="index"
          @click="handleAlbumClick(item)"
        >
          <image :src="item.coverUrl" mode="aspectFill"/>
          <view class="album-info">
            <text class="album-name">{{ item.name }}</text>
            <text class="album-desc">{{ item.description }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 推荐课程 -->
    <view class="section">
      <view class="section-title">推荐课程</view>
      <view class="course-list">
        <view 
          class="course-item" 
          v-for="(item, index) in home.featuredCourses" 
          :key="index"
          @click="handleCourseClick(item)"
        >
          <image :src="item.coverUrl" mode="aspectFill"/>
          <view class="course-info">
            <text class="course-name">{{ item.name }}</text>
            <text class="course-desc">{{ item.description }}</text>
            <view class="course-meta">
              <text class="course-price">¥{{ item.price }}</text>
              <text class="course-count">{{ item.studentCount }}人学习</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <!-- 错误提示 -->
    <view class="error" v-if="error">
      <text>{{ error }}</text>
      <button @click="onPullDownRefresh">重试</button>
    </view>
  </view>
</template>

<script>
import pageMixin from '@/mixins/page';

export default {
  name: 'Home',
  mixins: [pageMixin],
  
  data() {
    return {
      // 页面特定的数据
    };
  },
  
  async onLoad() {
    try {
      this.showLoading();
      await this.fetchHomeData();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoading();
    }
  },
  
  methods: {
    // 处理轮播图点击
    handleBannerClick(item) {
      // 根据banner的type和targetId跳转到对应页面
      switch (item.type) {
        case 'course':
          uni.navigateTo({
            url: `/pages/course/detail?id=${item.targetId}`
          });
          break;
        case 'album':
          uni.navigateTo({
            url: `/pages/album/detail?id=${item.targetId}`
          });
          break;
        case 'category':
          uni.navigateTo({
            url: `/pages/category/detail?id=${item.targetId}`
          });
          break;
      }
    },
    
    // 处理分类点击
    handleCategoryClick(item) {
      uni.navigateTo({
        url: `/pages/category/detail?id=${item.id}`
      });
    },
    
    // 处理专辑点击
    handleAlbumClick(item) {
      uni.navigateTo({
        url: `/pages/album/detail?id=${item.id}`
      });
    },
    
    // 处理课程点击
    handleCourseClick(item) {
      uni.navigateTo({
        url: `/pages/course/detail?id=${item.id}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding-bottom: 20rpx;
  
  .banner {
    height: 300rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .section {
    margin-top: 30rpx;
    padding: 0 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    
    .category-list {
      display: flex;
      flex-wrap: wrap;
      
      .category-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20rpx;
        
        image {
          width: 80rpx;
          height: 80rpx;
          margin-bottom: 10rpx;
        }
        
        text {
          font-size: 24rpx;
          color: #333;
        }
      }
    }
    
    .album-list {
      .album-item {
        display: flex;
        margin-bottom: 20rpx;
        
        image {
          width: 200rpx;
          height: 150rpx;
          border-radius: 10rpx;
        }
        
        .album-info {
          flex: 1;
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .album-name {
            font-size: 28rpx;
            font-weight: bold;
          }
          
          .album-desc {
            font-size: 24rpx;
            color: #666;
            @include text-ellipsis(2);
          }
        }
      }
    }
    
    .course-list {
      .course-item {
        display: flex;
        margin-bottom: 20rpx;
        
        image {
          width: 200rpx;
          height: 150rpx;
          border-radius: 10rpx;
        }
        
        .course-info {
          flex: 1;
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .course-name {
            font-size: 28rpx;
            font-weight: bold;
          }
          
          .course-desc {
            font-size: 24rpx;
            color: #666;
            @include text-ellipsis(2);
          }
          
          .course-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .course-price {
              font-size: 32rpx;
              color: #f56c6c;
              font-weight: bold;
            }
            
            .course-count {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
  }
  
  .loading, .error {
    text-align: center;
    padding: 20rpx;
    
    text {
      color: #999;
    }
    
    button {
      margin-top: 20rpx;
    }
  }
}
</style> 
