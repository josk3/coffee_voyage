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
      :scroll-with-animation="true"
      @scroll="onScroll"
      :style="{ height: scrollViewHeight + 'px' }"
      :scroll-into-view="scrollIntoView"
    >
      <view v-for="cat in data.categories" :key="cat.id" :id="`category-${cat.id}`" class="category-section">
        <!-- 分类标题 -->
        <view class="category-title">{{ cat.name }}</view>
        
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
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue';

// 当前选中的分类ID
const currentCategory = ref(4); // 默认选中"评茶员课程"
const scrollTop = ref(0);
const scrollViewHeight = ref(0);
const categoryOffsets = ref({});
const isScrolling = ref(false);
const scrollIntoView = ref('');

// 模拟后端接口返回的所有类别和课程数据
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

// 计算当前选中分类的课程数据
const currentCategoryData = computed(() => {
  return data.categoryData[currentCategory.value] || null;
});

// 初始化
onMounted(() => {
  // 设置scroll-view的高度为屏幕高度
  scrollViewHeight.value = uni.getWindowInfo().windowHeight;
  
  // 延迟获取各个分类的位置信息
  setTimeout(() => {
    calculateCategoryOffsets();
    // 初始化时默认滚动到默认分类
    scrollIntoView.value = `category-${currentCategory.value}`;
  }, 300);
});

// 计算每个分类的位置信息
const calculateCategoryOffsets = () => {
  data.categories.forEach(cat => {
    const query = uni.createSelectorQuery();
    query.select(`#category-${cat.id}`).boundingClientRect(rect => {
      if (rect) {
        categoryOffsets.value[cat.id] = rect.top;
      }
    }).exec();
  });
};

// 监听滚动事件
const onScroll = (e) => {
  if (isScrolling.value) return;
  
  const scrollTop = e.detail.scrollTop;
  let closestCategory = data.categories[0].id;
  let minDistance = Infinity;
  
  // 找出最接近当前滚动位置的分类
  // 为了使左侧导航在分类标题接近顶部时就响应变化，添加一个偏移量
  const offsetThreshold = 10; // 距离顶部的阈值
  
  Object.entries(categoryOffsets.value).forEach(([catId, offset]) => {
    // 计算距离时，考虑标题滚动到顶部附近即视为当前分类
    // 只有当scrollTop大于等于offset减去阈值时才考虑为可能的当前分类
    if (scrollTop >= offset - offsetThreshold) {
      const distance = Math.abs(scrollTop - offset);
      if (distance < minDistance) {
        minDistance = distance;
        closestCategory = parseInt(catId);
      }
    }
  });
  
  // 如果最接近的分类与当前选中的不同，则更新当前分类
  if (closestCategory !== currentCategory.value) {
    currentCategory.value = closestCategory;
  }
};

// 切换分类
const switchCategory = (categoryId) => {
  console.log('切换到分类ID:', categoryId);
  currentCategory.value = categoryId;
  
  // 防止滚动事件重复触发分类切换
  isScrolling.value = true;
  
  // 使用scroll-into-view直接滚动到目标元素
  scrollIntoView.value = `category-${categoryId}`;
  
  // 滚动动画完成后重新启用滚动事件监听
  setTimeout(() => {
    isScrolling.value = false;
    
    // 更新一次位置信息，确保后续的滚动监听准确
    nextTick(() => {
      calculateCategoryOffsets();
    });
  }, 500);
};

// 跳转到课程详情
const goToCourseDetail = (course) => {
  console.log('跳转到课程:', course.title, '课程ID:', course.id, '价格:', course.price);
  // 显示加载提示
  uni.showLoading({
    title: '正在加载...'
  });
  
  // 实际应用中，这里会跳转到对应的课程详情页
  uni.navigateTo({
    url: `/pages/course/detail?id=${course.id}`,
    success: () => {
      // 跳转成功后隐藏加载提示
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
</style> 