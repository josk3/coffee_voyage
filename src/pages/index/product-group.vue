<template>
  <view class="container">
    <!-- 左侧分类导航 -->
    <view class="category-nav">
      <view 
        v-for="(category, index) in categoryList" 
        :key="category._id" 
        :class="['category-item', currentCategory === index ? 'active' : '']"
        @click="switchCategory(index)"
      >
        {{ category.name }}
      </view>
    </view>
    
    <!-- 右侧内容区域 -->
    <scroll-view 
      class="content-area" 
      scroll-y 
      :scroll-into-view="scrollIntoView"
      @scroll="onScroll" 
      scroll-with-animation
    >
      <view 
        v-for="category in categoryList" 
        :key="category._id"
        :id="'category-' + category._id"
        class="category-section"
      >
        <view class="category-title">{{ category.name }}</view>
        
        <!-- 课程级别 -->
        <view class="level-container" v-if="category.courses && category.courses.length > 0">
          <view 
            v-for="(level, levelIndex) in getLevelsForCategory(category.id)" 
            :key="levelIndex" 
            class="level-section"
          >
            <view class="level-title">{{ getLevelName(level) }}</view>
            
            <!-- 课程卡片 -->
            <view class="course-list">
              <view 
                v-for="course in getCoursesForLevel(category.id, level)" 
                :key="course.id" 
                class="course-card"
                @click="goToCourseDetail(course.id)"
              >
                <image :src="course.coverUrl" class="course-image" mode="aspectFill"></image>
                <view class="course-info">
                  <text class="course-name">{{ course.name }}</text>
                  <view class="course-meta">
                    <text class="course-teacher">{{ course.teacherName }}</text>
                    <text class="course-price">{{ course.price === 0 ? '免费' : '¥' + course.price }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 无课程提示 -->
        <view class="empty-tips" v-else>
          <text>暂无课程</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
// import { categoryAPI, courseAPI } from '@/api/index';

// 响应式状态
const categoryList = ref([]);
const currentCategory = ref(0);
const scrollTop = ref(0);
const scrollViewHeight = ref(0);
const scrollIntoView = ref('');
const categoryOffsets = ref({});

// 占位数据
const mockCategories = [
  {
    _id: '1',
    id: '1',
    name: '咖啡',
    courses: [
      {
        id: '101',
        name: '拿铁制作入门',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '王老师',
        price: 0,
        level: 0
      },
      {
        id: '102',
        name: '手冲咖啡技巧',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '李老师',
        price: 39,
        level: 1
      },
      {
        id: '103',
        name: '咖啡拉花艺术',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '张老师',
        price: 59,
        level: 2
      }
    ]
  },
  {
    _id: '2',
    id: '2',
    name: '茶饮',
    courses: [
      {
        id: '201',
        name: '中国茶道基础',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '刘老师',
        price: 0,
        level: 0
      },
      {
        id: '202',
        name: '奶茶调制技巧',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '陈老师',
        price: 29,
        level: 1
      }
    ]
  },
  {
    _id: '3',
    id: '3',
    name: '烘焙',
    courses: [
      {
        id: '301',
        name: '面包制作基础',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '周老师',
        price: 49,
        level: 0
      },
      {
        id: '302',
        name: '甜点装饰艺术',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '赵老师',
        price: 69,
        level: 1
      },
      {
        id: '303',
        name: '高级西点制作',
        coverUrl: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg',
        teacherName: '钱老师',
        price: 99,
        level: 2
      }
    ]
  }
];

// 加载分类数据
async function fetchCategories() {
  // try {
  //   const res = await categoryAPI.getAllCategories();
  //   categoryList.value = res.data || [];
    
  //   // 获取每个分类的课程
  //   if (categoryList.value.length > 0) {
  //     await fetchCoursesForCategories();
      
  //     // 初始化完成后计算分类偏移量
  //     nextTick(() => {
  //       calculateCategoryOffsets();
  //       // 初始滚动到第一个分类
  //       if (categoryList.value.length > 0) {
  //         scrollIntoView.value = `category-${categoryList.value[0].id}`;
  //       }
  //     });
  //   }
  //   console.log('categoryList.value', categoryList.value);
  // } catch (error) {
  //   console.error('获取分类出错:', error);
  //   uni.showToast({
  //     title: '获取分类失败',
  //     icon: 'none'
  //   });
  // }
  
  // 使用占位数据
  categoryList.value = mockCategories;
  
  // 初始化完成后计算分类偏移量
  nextTick(() => {
    calculateCategoryOffsets();
    // 初始滚动到第一个分类
    if (categoryList.value.length > 0) {
      scrollIntoView.value = `category-${categoryList.value[0].id}`;
    }
  });
  
  console.log('使用占位数据:', categoryList.value);
}

// 获取所有分类的课程
async function fetchCoursesForCategories() {
  // try {
  //   console.log('开始获取分类课程');
  //   const promises = categoryList.value.map(async (category) => {
  //     try {
  //       console.log(`获取分类 ${category.name} 的课程，ID: ${category.id || category._id}`);
  //       const res = await courseAPI.getCategoryCourses(category._id, { limit: 20 });
  //       console.log(`分类 ${category.name} 课程获取结果:`, res);
  //       category.courses = res.data?.courses || [];
  //     } catch (error) {
  //       console.error(`获取分类 ${category.name} 课程出错:`, error);
  //       category.courses = [];
  //     }
  //   });
    
  //   await Promise.all(promises);
  //   console.log('所有分类课程获取完成', categoryList.value);
  // } catch (error) {
  //   console.error('获取课程总体出错:', error);
  //   uni.showToast({
  //     title: '获取课程失败',
  //     icon: 'none'
  //   });
  // }
  
  // 注: 不需要实现，因为已经在mockCategories中包含了courses数据
  console.log('使用占位数据中的课程信息');
}

// 计算每个分类的滚动偏移量
function calculateCategoryOffsets() {
  const query = uni.createSelectorQuery();
  categoryList.value.forEach(category => {
    query.select(`#category-${category.id}`).boundingClientRect();
  });
  query.exec(rects => {
    if (Array.isArray(rects) && rects[0]) {
      rects.forEach((rect, index) => {
        if (rect) {
          const categoryId = categoryList.value[index].id;
          categoryOffsets.value[categoryId] = rect.top;
        }
      });
    }
  });
}

// 切换分类
function switchCategory(index) {
  currentCategory.value = index;
  if (categoryList.value[index]) {
    scrollIntoView.value = `category-${categoryList.value[index].id}`;
  }
}

// 滚动事件处理
function onScroll(e) {
  scrollTop.value = e.detail.scrollTop;
  
  // 根据滚动位置更新当前分类
  updateCurrentCategoryByScroll();
  
  // 滚动后重新计算偏移量（考虑到可能的动态高度变化）
  if (e.detail.scrollTop % 200 === 0) {
    calculateCategoryOffsets();
  }
}

// 根据滚动位置更新当前分类
function updateCurrentCategoryByScroll() {
  if (Object.keys(categoryOffsets.value).length === 0) return;
  
  const scrollPosition = scrollTop.value;
  let minDistance = Number.MAX_VALUE;
  let currentCategoryIndex = 0;
  
  categoryList.value.forEach((category, index) => {
    const offset = categoryOffsets.value[category.id] || 0;
    const distance = Math.abs(offset - scrollPosition);
    
    if (distance < minDistance) {
      minDistance = distance;
      currentCategoryIndex = index;
    }
  });
  
  // 更新当前分类索引（如果不同）
  if (currentCategory.value !== currentCategoryIndex) {
    currentCategory.value = currentCategoryIndex;
  }
}

// 获取分类的课程级别
function getLevelsForCategory(categoryId) {
  const categoryCourses = categoryList.value.find(c => c.id === categoryId)?.courses || [];
  const levels = new Set();
  
  categoryCourses.forEach(course => {
    if (course.level !== undefined) {
      levels.add(course.level);
    }
  });
  
  return Array.from(levels).sort((a, b) => a - b);
}

// 获取级别名称
function getLevelName(level) {
  const levelMap = {
    0: '初级',
    1: '中级',
    2: '高级'
  };
  return levelMap[level] || '未知级别';
}

// 获取特定级别的课程
function getCoursesForLevel(categoryId, level) {
  const categoryCourses = categoryList.value.find(c => c.id === categoryId)?.courses || [];
  return categoryCourses.filter(course => course.level === level);
}

// 跳转到课程详情页
function goToCourseDetail(courseId) {
  uni.navigateTo({
    url: `/pages/course/detail?id=${courseId}`
  });
}

// 组件挂载时初始化数据
onMounted(() => {
  // 获取滚动视图高度
  const systemInfo = uni.getSystemInfoSync();
  scrollViewHeight.value = systemInfo.windowHeight;
  
  // 获取分类数据
  fetchCategories();
});
</script>

<style>
.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.category-nav {
  width: 180rpx;
  height: 100%;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.category-item {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10rpx;
}

.category-item.active {
  background-color: #fff;
  color: #1890ff;
  font-weight: bold;
  position: relative;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30rpx;
  height: 40rpx;
  width: 6rpx;
  background-color: #1890ff;
}

.content-area {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
}

.category-section {
  padding: 20rpx;
}

.category-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
  border-left: 8rpx solid #1890ff;
}

.level-container {
  margin-bottom: 30rpx;
}

.level-section {
  margin-bottom: 20rpx;
}

.level-title {
  font-size: 28rpx;
  color: #666;
  margin: 10rpx 0;
}

.course-list {
  display: flex;
  flex-wrap: wrap;
}

.course-card {
  width: 330rpx;
  margin: 10rpx;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 180rpx;
}

.course-info {
  padding: 10rpx 15rpx;
}

.course-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}

.course-teacher {
  font-size: 24rpx;
  color: #666;
}

.course-price {
  font-size: 24rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.empty-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  color: #999;
  font-size: 28rpx;
}
</style> 