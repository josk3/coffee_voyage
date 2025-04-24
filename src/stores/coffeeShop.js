import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export const useCoffeeShopStore = defineStore('coffeeShop', {
  state: () => ({
    list: [],
    detail: null,
    reviews: []
  }),
  actions: {
    setCoffeeShopList(coffeeShops) {
      this.list = coffeeShops;
      console.log('咖啡店列表:', this.list);
    },
    setCoffeeShopDetail(coffeeShopDetail) {
      this.detail = coffeeShopDetail;
    },
    setShopReviews(reviews) {
      this.reviews = reviews;
    },
    async fetchCoffeeShopList() {
      try {
        uni.request({
          url: 'http://localhost:3000/api/coffee-shops',
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              this.setCoffeeShopList(res.data.data.items);
            } else {
              throw new Error('Failed to fetch coffee shops');
            }
          },
          fail: (err) => {
            console.error(err);
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCoffeeShopDetail(id) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `http://localhost:3000/api/coffee-shops/${id}`,
          method: 'GET',
          success: (res) => {
            console.log('API响应数据:', JSON.stringify(res.data));
            
            // 无论响应如何，都将数据存储并返回
            if (res.statusCode === 200) {
              // 检查data是否存在且是有效数据
              if (res.data && res.data.data) {
                this.setCoffeeShopDetail(res.data.data);
                resolve(res.data.data);
              } else {
                console.warn('API返回数据格式不符合预期:', res.data);
                // 尝试使用整个响应作为数据
                this.setCoffeeShopDetail(res.data);
                resolve(res.data);
              }
            } else {
              console.error('API响应状态码异常:', res.statusCode, res.data);
              reject(new Error('获取详情失败: ' + (res.data.message || '未知错误')));
            }
          },
          fail: (err) => {
            console.error('请求失败:', err);
            reject(err);
          }
        });
      });
    },
    async fetchShopReviews(shopId) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `http://localhost:3000/api/coffee-shops/${shopId}/reviews`,
          method: 'GET',
          success: (res) => {
            console.log('获取评价响应数据:', JSON.stringify(res.data));
            
            // 修改判断逻辑，只要状态码为200就认为成功
            if (res.statusCode === 200) {
              // 检查返回的数据是否有效
              if (res.data && (res.data.data || Array.isArray(res.data))) {
                // 如果是标准格式，使用data字段
                const reviewsData = Array.isArray(res.data) ? res.data : 
                                   (Array.isArray(res.data.data) ? res.data.data : []);
                
                // 格式化评价数据
                const formattedReviews = reviewsData.map(item => ({
                  id: item._id || item.id,
                  name: item.userName || item.name || '匿名用户',
                  avatar: item.userAvatar || item.avatar,
                  rating: item.rating || 5,
                  date: this.formatDate(item.createdAt || item.date),
                  text: item.content || item.text,
                  images: item.images || []
                }));
                
                this.setShopReviews(formattedReviews);
                resolve(formattedReviews);
              } else {
                console.warn('评价数据格式不符合预期:', res.data);
                this.setShopReviews([]);
                resolve([]);
              }
            } else {
              console.error('API响应状态码异常:', res.statusCode, res.data);
              reject(new Error('获取评价失败: ' + (res.data.message || '未知错误')));
            }
          },
          fail: (err) => {
            console.error('请求评价失败:', err);
            reject(err);
          }
        });
      });
    },
    // 删除评论的方法
    async deleteReview(shopId, reviewId) {
      return new Promise((resolve, reject) => {
        if (!shopId || !reviewId) {
          reject(new Error('删除评价需要有效的shopId和reviewId'));
          return;
        }
        
        uni.showLoading({
          title: '删除中...',
          mask: true
        });
        
        uni.request({
          url: `http://localhost:3000/api/coffee-shops/${shopId}/reviews/${reviewId}`,
          method: 'DELETE',
          success: (res) => {
            if (res.statusCode === 200) {
              // 从store中删除评论
              this.removeReviewFromStore(reviewId);
              
              // 如果咖啡店详情中有评论，也更新详情中的评论
              if (this.detail && this.detail.reviews) {
                const reviewIndex = this.detail.reviews.findIndex(
                  r => (r._id && r._id === reviewId) || (r.id && r.id === reviewId)
                );
                if (reviewIndex !== -1) {
                  this.detail.reviews.splice(reviewIndex, 1);
                  
                  // 更新评论数
                  if (this.detail.reviewCount !== undefined) {
                    this.detail.reviewCount = Math.max(0, this.detail.reviewCount - 1);
                  }
                }
              }
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              
              // 触发全局事件，通知其他页面刷新
              uni.$emit('refreshShopDetail', {
                shopId: shopId,
                timestamp: Date.now()
              });
              
              resolve(res.data);
            } else {
              let errorMsg = '删除失败';
              if (res.data && (res.data.message || res.data.msg)) {
                errorMsg = res.data.message || res.data.msg;
              }
              
              uni.showToast({
                title: errorMsg,
                icon: 'none'
              });
              
              reject(new Error(errorMsg));
            }
          },
          fail: (err) => {
            console.error('删除评价失败:', err);
            uni.showToast({
              title: '网络错误，请稍后重试',
              icon: 'none'
            });
            
            reject(err);
          },
          complete: () => {
            uni.hideLoading();
          }
        });
      });
    },
    // 从store中删除评论
    removeReviewFromStore(reviewId) {
      if (!this.reviews || !this.reviews.length) return;
      
      const index = this.reviews.findIndex(
        review => (review._id && review._id === reviewId) || (review.id && review.id === reviewId)
      );
      
      if (index !== -1) {
        this.reviews.splice(index, 1);
      }
    },
    // 工具方法：格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  }
}); 