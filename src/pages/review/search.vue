<template>
  <view class="search-container">
    <!-- 搜索头部 -->
    <view class="search-header">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          type="text" 
          v-model="searchKeyword" 
          placeholder="请输入菜品名称..." 
          confirm-type="search"
          focus
          @confirm="doSearch"
        />
        <text class="clear-icon" v-if="searchKeyword" @click="clearSearch">×</text>
      </view>
      <view class="cancel-btn" @click="goBack">取消</view>
    </view>
    
    <!-- 搜索结果区域 -->
    <view class="search-results" v-if="hasSearched">
      <view class="result-header">
        <text class="result-title">搜索结果</text>
        <text class="result-count">共{{ searchResults.length }}个结果</text>
      </view>
      
      <view class="empty-result" v-if="searchResults.length === 0">
        <text class="empty-text">没有找到相关菜品</text>
      </view>
      
      <view 
        class="result-item" 
        v-for="item in searchResults" 
        :key="item.id"
        @click="viewItemDetail(item)"
      >
        <!-- 图片区域 -->
        <image :src="item.image" mode="aspectFill" class="item-image"></image>
        
        <!-- 商品信息 -->
        <view class="item-info">
          <view class="item-name">{{ item.name }}</view>
          <view class="item-price">¥{{ item.price }}</view>
        </view>
        
        <!-- 添加按钮 -->
        <view class="add-btn" @click.stop="addToCart(item)">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>
    
    <!-- 搜索历史和热门搜索 -->
    <view class="search-help" v-else>
      <!-- 搜索历史 -->
      <view class="search-history" v-if="searchHistory.length > 0">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <text class="clear-all" @click="clearHistory">清空</text>
        </view>
        <view class="history-tags">
          <view 
            class="history-tag" 
            v-for="(item, index) in searchHistory" 
            :key="index"
            @click="useHistoryItem(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>
      
      <!-- 热门搜索 -->
      <view class="hot-search">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="hot-tags">
          <view 
            class="hot-tag" 
            v-for="(item, index) in hotSearches" 
            :key="index"
            @click="useHistoryItem(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 搜索关键词
const searchKeyword = ref('');
// 是否已经搜索过
const hasSearched = ref(false);
// 搜索历史
const searchHistory = ref(['生椰拿铁', '陨石拿铁', '冰吸']);
// 热门搜索
const hotSearches = ref([
  '冰吸生椰拿铁', 
  '陨石拿铁', 
  '生椰丝绒拿铁', 
  '冰镇杨梅瑞纳冰', 
  '小黄油拿铁',
  '太妃榛香拿铁'
]);

// 示例菜品数据（实际应该从api获取）
const allItems = ref([
  {
    id: 1,
    name: '冰吸生椰拿铁',
    price: 32,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 2,
    name: '陨石拿铁',
    price: 32,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 3,
    name: '生椰丝绒拿铁',
    price: 35,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 4,
    name: '冰镇杨梅瑞纳冰',
    price: 38,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 5,
    name: '小黄油拿铁',
    price: 25,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 6,
    name: '太妃榛香拿铁',
    price: 28,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 7,
    name: '费尔岛拿铁',
    price: 30,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  },
  {
    id: 8,
    name: '西梅拿铁',
    price: 26,
    image: 'https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg'
  }
]);

// 搜索结果
const searchResults = ref([]);

// 执行搜索
const doSearch = () => {
  if (!searchKeyword.value.trim()) return;
  
  console.log('搜索关键词:', searchKeyword.value);
  hasSearched.value = true;
  
  // 保存到搜索历史（不重复）
  if (!searchHistory.value.includes(searchKeyword.value)) {
    searchHistory.value.unshift(searchKeyword.value);
    // 只保留最近10条
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10);
    }
    // 本地存储历史记录
    uni.setStorageSync('searchHistory', JSON.stringify(searchHistory.value));
  }
  
  // 模拟搜索结果
  const keyword = searchKeyword.value.toLowerCase();
  searchResults.value = allItems.value.filter(item => 
    item.name.toLowerCase().includes(keyword)
  );
  
  // 实际逻辑：调用API搜索
  // searchFromApi(searchKeyword.value);
};

// 从API搜索（实际使用时取消注释）
const searchFromApi = (keyword) => {
  // uni.request({
  //   url: 'https://api.example.com/search',
  //   method: 'GET',
  //   data: {
  //     keyword: keyword
  //   },
  //   success: (res) => {
  //     if (res.data.success) {
  //       searchResults.value = res.data.items;
  //     }
  //   }
  // });
};

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = '';
  hasSearched.value = false;
};

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = [];
        uni.removeStorageSync('searchHistory');
      }
    }
  });
};

// 使用历史记录项
const useHistoryItem = (item) => {
  searchKeyword.value = item;
  doSearch();
};

// 查看商品详情
const viewItemDetail = (item) => {
  console.log('查看商品详情:', item.name);
  uni.showToast({
    title: `查看${item.name}详情`,
    icon: 'none'
  });
  
  // 实际逻辑：跳转到商品详情页
  // uni.navigateTo({
  //   url: `/pages/product/detail?id=${item.id}`
  // });
};

// 添加到购物车
const addToCart = (item) => {
  console.log('添加到购物车:', item.name);
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  });
  
  // 实际逻辑：调用后端API添加商品到购物车
  // uni.request({
  //   url: 'https://api.example.com/cart/add',
  //   method: 'POST',
  //   data: {
  //     productId: item.id,
  //     quantity: 1
  //   },
  //   success: (res) => {
  //     if (res.data.success) {
  //       uni.showToast({
  //         title: '已加入购物车',
  //         icon: 'success'
  //       });
  //     }
  //   }
  // });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 获取本地存储的搜索历史
  try {
    const history = uni.getStorageSync('searchHistory');
    if (history) {
      searchHistory.value = JSON.parse(history);
    }
  } catch (e) {
    console.error('获取搜索历史失败', e);
  }
  
  // 获取传递过来的关键词（如果有）
  const query = uni.$route ? uni.$route.query : uni.getEnterOptionsSync().query;
  if (query && query.keyword) {
    searchKeyword.value = query.keyword;
    doSearch();
  }
});
</script>

<style lang="scss">
.search-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  // padding-top: 100rpx;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  
  .search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f2f2f2;
    border-radius: 40rpx;
    padding: 15rpx 20rpx;
    margin-right: 20rpx;
    
    .search-icon {
      font-size: 32rpx;
      color: #999;
      margin-right: 10rpx;
    }
    
    .search-input {
      flex: 1;
      height: 60rpx;
      font-size: 28rpx;
      border: none;
      outline: none;
    }
    
    .clear-icon {
      font-size: 36rpx;
      color: #999;
      padding: 0 10rpx;
    }
  }
  
  .cancel-btn {
    font-size: 30rpx;
    color: #333;
  }
}

.search-results {
  background-color: #fff;
  margin-top: 20rpx;
  
  .result-header {
    display: flex;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1px solid #f0f0f0;
    
    .result-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .result-count {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .empty-result {
    padding: 100rpx 0;
    text-align: center;
    
    .empty-text {
      font-size: 30rpx;
      color: #999;
    }
  }
  
  .result-item {
    display: flex;
    padding: 30rpx;
    border-bottom: 1px solid #f0f0f0;
    
    .item-image {
      width: 150rpx;
      height: 150rpx;
      border-radius: 6rpx;
      margin-right: 20rpx;
    }
    
    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .item-name {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 15rpx;
      }
      
      .item-price {
        font-size: 30rpx;
        color: #333;
        font-weight: bold;
      }
    }
    
    .add-btn {
      width: 60rpx;
      height: 60rpx;
      background-color: #f0f0f0;
      border-radius: 6rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      
      .add-icon {
        font-size: 40rpx;
        color: #666;
      }
    }
  }
}

.search-help {
  padding: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .clear-all {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .history-tags,
  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    
    .history-tag,
    .hot-tag {
      padding: 15rpx 30rpx;
      background-color: #fff;
      border-radius: 30rpx;
      margin-right: 15rpx;
      margin-bottom: 15rpx;
      font-size: 26rpx;
      color: #333;
    }
  }
  
  .search-history {
    margin-bottom: 40rpx;
  }
}
</style> 