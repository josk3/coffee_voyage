<template>
  <view class="product-group-container">
    <!-- 左侧分类导航 -->
    <view class="category-nav">
      <view 
        v-for="cat in data.categories" 
        :key="cat.id" 
        class="category-item"
        :class="{ active: currentCategory === cat.id }"
        @click="switchCategory(cat.id)"
      >
        {{ cat.name }}
      </view>
    </view>
    
    <!-- 右侧内容区 -->
    <scroll-view 
      class="content-area" 
      scroll-y 
      :scroll-top="scrollTop" 
      :scroll-with-animation="false"
      @scroll="onScroll"
      :style="{ height: scrollViewHeight + 'px' }"
      :scroll-into-view="scrollIntoView"
      :lower-threshold="100"
      @scrolltolower="onScrollToLower"
    >
      <view v-for="(cat, index) in data.categories" :key="cat.id" :id="`category-${cat.id}`" class="category-section">
        <!-- 分类标题 -->
        <view class="category-title" :data-index="index" :id="`title-${cat.id}`">{{ cat.name }}</view>
        
        <!-- 顶部主图 -->
        <view class="main-course" v-if="data.categoryData[cat.id]">
          <image class="main-course-image" :src="data.categoryData[cat.id].mainCourse.image" mode="aspectFill" />
          <view class="main-course-info">
            <view class="main-course-title">{{ data.categoryData[cat.id].mainCourse.title }}</view>
            <view class="main-course-desc">{{ data.categoryData[cat.id].mainCourse.description }}</view>
          </view>
        </view>
        
        <!-- 课程级别卡片 -->
        <view class="course-level-section" v-if="data.categoryData[cat.id]">
          <view class="level-item" 
                v-for="level in data.categoryData[cat.id].courseLevels" 
                :key="level.id"
                @click="goToCourseDetail(level)"
          >
            <!-- 卡片图片 -->
            <view class="level-card">
              <image class="level-logo" :src="level.logo" mode="aspectFill" />
            </view>
            <!-- 卡片下方标题 -->
            <view class="level-title">{{ level.title }}</view>
          </view>
        </view>
      </view>
      
      <!-- 底部占位空间和提示 -->
      <view class="bottom-space" :style="{ height: bottomSpaceHeight + 'px' }"></view>
      <view class="bottom-tip" v-if="showBottomTip">
        <view class="tip-line"></view>
        <text class="tip-text">到达最底部啦</text>
        <view class="tip-line"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue';

// 响应式状态
const currentCategory = ref(1); // 当前选中的分类ID，默认为第一个
const scrollTop = ref(0);
const scrollViewHeight = ref(0);
const scrollIntoView = ref('');
const isScrolling = ref(false);
const isUserClicking = ref(false); // 标记是否由用户点击导致的滚动
const showBottomTip = ref(false); // 底部提示状态
const bottomSpaceHeight = ref(300); // 底部额外空间高度

// 分类和课程数据
const data = reactive({
  // 分类列表
  categories: [
    { id: 1, name: '公共营养师' },
    { id: 2, name: '营养配餐' },
    { id: 3, name: '西式烹饪课程' },
    { id: 4, name: '评茶员课程' },
    { id: 5, name: '茶艺师课程' },
    { id: 6, name: '中式烹饪课程' },
    { id: 7, name: '中式面点课程' },
    { id: 8, name: '西式面点课程' },
    { id: 9, name: '咖啡师课程' },
  ],
  
  // 分类对应的课程数据
  categoryData: {
    // 公共营养师课程
    1: {
      mainCourse: {
        id: 101,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '公共营养师',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 1001, title: '公共营养师高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3980' },
        { id: 1002, title: '公共营养师中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2980' },
        { id: 1003, title: '公共营养师初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '1980' }
      ]
    },
    
    // 营养配餐课程
    2: {
      mainCourse: {
        id: 102,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '营养配餐',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 2001, title: '营养配餐高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3580' },
        { id: 2002, title: '营养配餐中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2580' }
      ]
    },
    
    // 西式烹饪课程
    3: {
      mainCourse: {
        id: 103,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '西式烹饪课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 3001, title: '西式烹饪高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '4980' },
        { id: 3002, title: '西式烹饪中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3680' },
        { id: 3003, title: '西式烹饪初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2680' }
      ]
    },
    
    // 评茶员课程
    4: {
      mainCourse: {
        id: 104,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '评茶员课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 4001, title: '评茶员高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3980' },
        { id: 4002, title: '评茶员中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2980' },
        { id: 4003, title: '评茶员初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '1980' }
      ]
    },
    
    // 茶艺师课程
    5: {
      mainCourse: {
        id: 105,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '茶艺师课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 5001, title: '茶艺师高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '4280' },
        { id: 5002, title: '茶艺师中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3280' },
        { id: 5003, title: '茶艺师初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2280' }
      ]
    },
    
    // 中式烹饪课程
    6: {
      mainCourse: {
        id: 106,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '中式烹饪课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 6001, title: '中式烹饪高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '4580' },
        { id: 6002, title: '中式烹饪中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3580' },
        { id: 6003, title: '中式烹饪初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2580' }
      ]
    },
    
    // 其他课程类别
    7: {
      mainCourse: {
        id: 107,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '中式面点课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 7001, title: '中式面点高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3780' },
        { id: 7002, title: '中式面点初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '1780' }
      ]
    },
    
    8: {
      mainCourse: {
        id: 108,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '西式面点课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 8001, title: '西式面点高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3880' },
        { id: 8002, title: '西式面点中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2880' }
      ]
    },
    
    9: {
      mainCourse: {
        id: 109,
        image: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg',
        title: '咖啡师课程',
        description: '轻松掌握技能—提升职业能级'
      },
      courseLevels: [
        { id: 9001, title: '咖啡师高级课程', level: 'advanced', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '4080' },
        { id: 9002, title: '咖啡师中级课程', level: 'intermediate', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '3080' },
        { id: 9003, title: '咖啡师初级课程', level: 'beginner', logo: 'https://pro.upload.logomaker.com.cn/2023/07/26/2307260649197721.jpg', price: '2080' }
      ]
    }
  }
});

// 当前选中分类的课程数据
const currentCategoryData = computed(() => {
  return data.categoryData[currentCategory.value] || null;
});

// 页面初始化
onMounted(() => {
  // 处理页面传入的参数
  handlePageParams();
  
  // 设置scroll-view的高度为屏幕高度
  scrollViewHeight.value = uni.getWindowInfo().windowHeight;
  
  // 延迟滚动到对应分类
  setTimeout(() => {
    scrollIntoView.value = `category-${currentCategory.value}`;
  }, 300);
});

// 接收页面参数
const handlePageParams = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.options || {};
  
  // 如果有指定分类ID，则切换到对应分类
  if (options.categoryId) {
    const categoryId = parseInt(options.categoryId);
    if (categoryId && data.categories.some(cat => cat.id === categoryId)) {
      currentCategory.value = categoryId;
    }
  }
};

// 滚动到底部事件处理
const onScrollToLower = () => {
  showBottomTip.value = true;
  
  // 如果当前不是最后一个分类，自动选中最后一个分类
  const lastCategoryId = data.categories[data.categories.length - 1].id;
  if (currentCategory.value !== lastCategoryId) {
    currentCategory.value = lastCategoryId;
  }
};

// 滚动事件处理
const onScroll = (e) => {
  if (isScrolling.value || isUserClicking.value) return;
  
  const scrollTop = e.detail.scrollTop;
  
  // 获取滚动区域的总高度和当前可见区域高度
  const scrollHeight = e.detail.scrollHeight || 0;
  const clientHeight = scrollViewHeight.value;
  
  // 检测是否滚动到底部或接近底部
  const isNearBottom = scrollTop + clientHeight + 50 >= scrollHeight;
  
  // 如果接近底部，显示底部提示并选中最后一个分类
  if (isNearBottom) {
    showBottomTip.value = true;
    const lastCategory = data.categories[data.categories.length - 1];
    if (lastCategory && lastCategory.id !== currentCategory.value) {
      currentCategory.value = lastCategory.id;
    }
    return;
  } else if (scrollTop < scrollHeight - clientHeight - 200) {
    // 如果距离底部还有一定距离，隐藏底部提示
    showBottomTip.value = false;
  }
  
  // 检测标题位置并更新左侧导航
  detectVisibleTitles();
};

// 检测可见的标题并更新导航
const detectVisibleTitles = () => {
  // 创建选择器查询
  const query = uni.createSelectorQuery();
  
  // 查询所有标题元素的位置
  query.selectAll('.category-title').boundingClientRect(rects => {
    if (!rects || !rects.length) return;
    
    // 找到最接近顶部的标题
    let bestTitleIndex = -1;
    let bestDistance = Infinity;
    
    // 定义严格的阈值范围 - 标题必须非常接近顶部
    const topThreshold = 30; // 只考虑接近顶部30px范围内的标题
    
    rects.forEach((rect, index) => {
      // 只有当标题接近顶部时才考虑更新导航
      if (rect.top >= -topThreshold && rect.top <= topThreshold) {
        const distance = Math.abs(rect.top);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestTitleIndex = index;
        }
      }
    });
    
    // 如果找到了合适的标题，更新左侧导航
    if (bestTitleIndex !== -1) {
      const categoryId = data.categories[bestTitleIndex].id;
      if (categoryId !== currentCategory.value) {
        currentCategory.value = categoryId;
      }
    }
  }).exec();
};

// 切换分类
const switchCategory = (categoryId) => {
  // 设置点击标志，防止滚动事件改变导航状态
  isUserClicking.value = true;
  currentCategory.value = categoryId;
  
  // 检查是否点击了最后一个分类
  const isLastCategory = categoryId === data.categories[data.categories.length - 1].id;
  if (isLastCategory) {
    // 如果是最后一个分类，在滚动后显示底部提示
    setTimeout(() => {
      showBottomTip.value = true;
    }, 300);
  } else {
    // 如果不是最后一个分类，隐藏底部提示
    showBottomTip.value = false;
  }
  
  // 防止滚动事件重复触发分类切换
  isScrolling.value = true;
  
  // 使用scroll-into-view直接滚动到目标元素
  scrollIntoView.value = `category-${categoryId}`;
  
  // 滚动完成后重新启用滚动事件监听
  setTimeout(() => {
    isScrolling.value = false;
    
    // 延迟一段时间后再允许滚动事件影响导航状态
    setTimeout(() => {
      isUserClicking.value = false;
    }, 200);
  }, 500);
};

// 跳转到课程详情
const goToCourseDetail = (course) => {
  // 显示加载提示
  uni.showLoading({
    title: '正在加载...'
  });
  
  // 跳转到对应的课程详情页
  uni.navigateTo({
    url: `/pages/course/detail?id=${course.id}`,
    success: () => {
      uni.hideLoading();
    },
    fail: (err) => {
      console.error('跳转失败:', err);
      uni.hideLoading();
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      });
    }
  });
};
</script>

<style>
.product-group-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 左侧导航栏 */
.category-nav {
  width: 180rpx;
  background-color: #f0f0f0;
  padding: 20rpx 0;
}

.category-item {
  padding: 30rpx 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  position: relative;
}

.category-item.active {
  background-color: #fff;
  color: #3b79b6;
  font-weight: bold;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 30rpx;
  background-color: #3b79b6;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  width: calc(100% - 180rpx);
}

/* 分类区块 */
.category-section {
  padding: 20rpx;
  margin-bottom: 40rpx;
}

.category-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-left: 20rpx;
  border-left: 8rpx solid #3b79b6;
}

/* 主课程展示 */
.main-course {
  position: relative;
  width: 100%;
  height: 300rpx;
  margin-bottom: 30rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.main-course-image {
  width: 100%;
  height: 100%;
}

.main-course-info {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 180rpx;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20rpx;
}

.main-course-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #7b9351;
  writing-mode: vertical-rl;
  text-orientation: upright;
  margin: 0 auto;
  letter-spacing: 5rpx;
}

.main-course-desc {
  font-size: 12rpx;
  color: #777;
  writing-mode: vertical-rl;
  text-orientation: upright;
  margin: 20rpx auto 0;
  letter-spacing: 2rpx;
  border-right: 1px solid #e0786f;
  border-left: 1px solid #e0786f;
  padding: 0 8rpx;
}

/* 课程级别卡片 */
.course-level-section {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.level-item {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-card {
  height: 200rpx;
  width: 100%;
  background-color: #3b79b6;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
  overflow: hidden;
  position: relative;
}

.level-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #3b79b6;
}

.level-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  text-align: center;
  padding: 10rpx 0;
}

/* 底部占位空间 */
.bottom-space {
  height: 300px;
}

/* 底部提示信息 */
.bottom-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  margin-top: 20rpx;
  margin-bottom: 60rpx;
}

.tip-line {
  flex: 1;
  height: 1px;
  background-color: #cccccc;
  max-width: 100rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #999999;
  margin: 0 20rpx;
  font-weight: normal;
}
</style> 