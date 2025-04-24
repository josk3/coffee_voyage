import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export const useCoffeeShopStore = defineStore('coffeeShop', {
  state: () => ({
    list: [],
    detail: null,
    reviews: [],
    recommendItems: []
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
    setRecommendItems(items) {
      this.recommendItems = items;
    },
    async fetchCoffeeShopList() {
      try {
        return new Promise((resolve, reject) => {
          uni.request({
            url: 'http://localhost:3000/api/coffee-shops',
            method: 'GET',
            success: (res) => {
              if (res.statusCode === 200) {
                // 检查返回数据格式
                if (res.data && res.data.code === 0 && res.data.data && Array.isArray(res.data.data.items)) {
                  // 符合新API格式的响应
                  this.setCoffeeShopList(res.data.data.items);
                  resolve(res.data.data.items);
                } else if (res.data && Array.isArray(res.data)) {
                  // 旧格式响应 - 直接是数组
                  this.setCoffeeShopList(res.data);
                  resolve(res.data);
                } else {
                  console.warn('咖啡店列表数据格式不符合预期:', res.data);
                  this.setCoffeeShopList([]);
                  resolve([]);
                }
              } else {
                console.error('获取咖啡店列表失败:', res.data);
                reject(new Error('获取咖啡店列表失败:' + (res.data.message || '未知错误')));
              }
            },
            fail: (err) => {
              console.error('请求咖啡店列表失败:', err);
              reject(err);
            }
          });
        });
      } catch (error) {
        console.error('咖啡店列表请求异常:', error);
        return Promise.reject(error);
      }
    },
    async fetchCoffeeShopDetail(id) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `http://localhost:3000/api/coffee-shops/${id}`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200 && res.data && res.data.code === 0) {
              // API返回正确格式的数据
              const shopData = res.data.data;
              
              // 格式化评价
              if (shopData.reviews) {
                shopData.reviews = shopData.reviews.map(review => ({
                  id: review.id,
                  name: review.name,
                  avatar: review.avatar,
                  rating: review.rating,
                  date: review.date,
                  text: review.text,
                  images: review.images || []
                }));
              }
              
              this.setCoffeeShopDetail(shopData);
              resolve(shopData);
            } else {
              console.warn('API返回数据格式不符合预期:', res.data);
              // 如果状态码是200但没有错误信息，直接尝试使用返回的数据
              if (res.statusCode === 200 && res.data && res.data.data) {
                this.setCoffeeShopDetail(res.data.data);
                resolve(res.data.data);
                return;
              }
              
              const errorMsg = (res.data && res.data.message) ? res.data.message : '获取详情失败';
              reject(new Error(errorMsg));
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
            if (res.statusCode === 200) {
              // 检查返回的数据是否有效，按照API实际格式，使用code === 0表示成功
              if (res.data && res.data.code === 0 && res.data.data) {
                const reviewsData = res.data.data;
                
                // 格式化评价数据，使字段名称与UI组件一致
                const formattedReviews = reviewsData.map(item => ({
                  id: item._id || item.id,
                  name: item.userName || '匿名用户',
                  avatar: item.userAvatar,
                  rating: item.rating || 5,
                  date: this.formatDate(item.createdAt),
                  text: item.content,
                  images: item.images || []
                }));

                console.log('评价数据:', formattedReviews);
                
                this.setShopReviews(formattedReviews);
                resolve(formattedReviews);
              } else {
                console.warn('评价数据格式不符合预期:', res.data);
                this.setShopReviews([]);
                resolve([]);
              }
            } else {
              // 尽管API返回了错误状态码，我们仍然可以成功解析
              console.warn('获取评价返回非200状态码:', res.statusCode);
              if (res.data && res.data.message) {
                console.warn('API返回消息:', res.data.message);
              }
              // 返回空数组而不是拒绝Promise
              this.setShopReviews([]);
              resolve([]);
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
            if (res.statusCode === 200 && res.data && res.data.code === 0) {
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
    },
    
    // 获取推荐菜单
    async fetchRecommendItems() {
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'http://localhost:3000/api/recommended-items',
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200 && res.data && res.data.code === 0) {
              console.log('获取推荐菜单成功:', res.data.data);
              this.setRecommendItems(res.data.data);
              resolve(res.data.data);
            } else {
              console.error('获取推荐菜单失败:', res.data);
              reject(new Error('获取推荐菜单失败: ' + (res.data.message || '未知错误')));
            }
          },
          fail: (err) => {
            console.error('请求推荐菜单接口失败:', err);
            reject(err);
          }
        });
      });
    }
  }
}); 