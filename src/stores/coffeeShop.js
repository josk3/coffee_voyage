import { defineStore } from 'pinia';
import { nextTick } from 'vue';

// 基础API URL
const BASE_API_URL = 'http://coffee-voyage.natapp1.cc/api';
// const BASE_API_URL = 'http://localhost:3000/api';

export const useCoffeeShopStore = defineStore('coffeeShop', {
  state: () => ({
    list: [],
    detail: null,
    reviews: [],
    recommendItems: [],
    baseApiUrl: BASE_API_URL // 将基础URL保存在state中，方便组件访问
  }),
  actions: {
    setCoffeeShopList(coffeeShops) {
      this.list = coffeeShops;
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
    
    // 创建新咖啡店
    createCoffeeShop(shopData) {
      console.log('调用createCoffeeShop方法，数据:', shopData);
      
      // 检查必填字段
      if (!shopData.shopName) {
        return Promise.reject(new Error('店铺名称不能为空'));
      }
      
      if (!shopData.shopImage) {
        return Promise.reject(new Error('店铺图片不能为空'));
      }
      
      if (!shopData.averagePrice) {
        return Promise.reject(new Error('人均价格不能为空'));
      }
      
      // 直接使用API文档中的数据结构
      const requestData = {
        shopName: shopData.shopName,
        shopImage: shopData.shopImage,
        rating: shopData.rating || 5,
        commentCount: shopData.commentCount || 0,
        averagePrice: shopData.averagePrice,
        images: shopData.images || []
      };
      
      // 添加评论数组
      if (Array.isArray(shopData.comments) && shopData.comments.length > 0) {
        requestData.comments = shopData.comments.map(comment => ({
          userName: comment.userName || "",
          userAvatar: comment.userAvatar || "",
          content: comment.content || ""
        }));
      } else {
        requestData.comments = [];
      }
      
      // 添加推荐菜品数组
      if (Array.isArray(shopData.recommendDishes) && shopData.recommendDishes.length > 0) {
        requestData.recommendDishes = shopData.recommendDishes.map(dish => ({
          dishName: dish.dishName || "",
          dishImage: dish.dishImage || "",
          price: dish.price || 0,
          recommendIndex: dish.recommendIndex || 5,
          description: dish.description || ""
        }));
        
        // 检查推荐菜品是否完整
        for (const dish of requestData.recommendDishes) {
          if (!dish.dishName) {
            return Promise.reject(new Error("菜品名称不能为空"));
          }
          if (!dish.dishImage) {
            return Promise.reject(new Error("菜品图片不能为空"));
          }
          if (!dish.price) {
            return Promise.reject(new Error("菜品价格不能为空"));
          }
        }
      } else {
        requestData.recommendDishes = [];
      }
      
      console.log('发送的请求数据:', JSON.stringify(requestData));
      
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${BASE_API_URL}/coffee-shops`,
          method: 'POST',
          data: requestData,
          header: {
            'Content-Type': 'application/json'
          },
          success: (res) => {
            try {
              console.log('创建咖啡店响应:', res);
              // 特殊情况处理：如果API返回了成功消息但格式不标准
              if (res.data && typeof res.data === 'object' && res.data.message && res.data.message.includes('成功')) {
                console.log('检测到成功消息:', res.data.message);
                // 刷新咖啡店列表
                this.fetchCoffeeShopList();
                resolve(res.data);
                return;
              }
              
              if (res.statusCode === 200 || res.statusCode === 201) {
                // 请求成功
                if (res.data && res.data.success) {
                  // 刷新咖啡店列表
                  this.fetchCoffeeShopList();
                  resolve(res.data.data);
                } else {
                  let errorMsg = '创建咖啡店失败';
                  if (res.data && res.data.message) {
                    // 特殊情况：消息包含"成功"关键词但被当作错误返回
                    if (res.data.message.includes('成功')) {
                      console.log('响应包含成功消息但可能格式不标准:', res.data);
                      this.fetchCoffeeShopList();
                      resolve(res.data);
                      return;
                    }
                    errorMsg = res.data.message;
                  }
                  reject(new Error(errorMsg));
                }
              } else {
                // 服务器返回错误
                let errorMsg = '创建咖啡店失败';
                if (res.data && res.data.message) {
                  errorMsg = res.data.message;
                }
                console.error('创建咖啡店API错误:', res.statusCode, res.data);
                reject(new Error(errorMsg));
              }
            } catch (error) {
              console.error('处理响应时发生错误:', error);
              
              // 如果错误消息包含成功关键词，仍然视为成功
              if (error && error.message && error.message.includes('成功')) {
                console.log('捕获到包含成功字样的错误，视为成功:', error.message);
                this.fetchCoffeeShopList();
                resolve({ success: true, message: error.message });
                return;
              }
              
              reject(error);
            }
          },
          fail: (err) => {
            console.error('创建咖啡店请求失败:', err);
            reject(err);
          }
        });
      });
    },
    
    async fetchCoffeeShopList() {
      try {
        return new Promise((resolve, reject) => {
          uni.request({
            url: `${BASE_API_URL}/coffee-shops`,
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
          url: `${BASE_API_URL}/coffee-shops/${id}`,
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
          url: `${BASE_API_URL}/coffee-shops/${shopId}/reviews`,
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
      if (!shopId || !reviewId) {
        throw new Error('店铺ID和评价ID不能为空');
      }

      return new Promise((resolve, reject) => {
        uni.request({
          url: `${this.baseApiUrl}/coffee-shops/${shopId}/reviews/${reviewId}`,
          method: 'DELETE',
          success: (res) => {
            if (res.statusCode === 200 && res.data && res.data.code === 0) {
              // 从 store 中移除该评价
              this.removeReviewFromStore(reviewId);
              
              // 更新店铺评分
              if (this.detail && this.detail.reviews) {
                const remainingReviews = this.detail.reviews.filter(review => {
                  const id = review._id || review.id;
                  return id !== reviewId;
                });
                
                if (remainingReviews.length > 0) {
                  const totalRating = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
                  this.detail.rating = totalRating / remainingReviews.length;
                } else {
                  this.detail.rating = 5; // 如果没有评价了，恢复默认评分
                }
              }
              
              resolve(res.data);
            } else {
              const errMsg = (res.data && res.data.message) ? res.data.message : '删除失败';
              reject(new Error(errMsg));
            }
          },
          fail: (err) => {
            console.error('删除评价请求失败:', err);
            reject(new Error('网络错误，请稍后重试'));
          }
        });
      });
    },
    // 从store中删除评论
    removeReviewFromStore(reviewId) {
      if (!reviewId) return;
      
      // 从 reviews 数组中移除
      this.reviews = this.reviews.filter(review => {
        const id = review._id || review.id;
        return id !== reviewId;
      });
      
      // 如果当前查看的是店铺详情，也需要从详情中移除该评价
      if (this.detail && this.detail.reviews) {
        this.detail.reviews = this.detail.reviews.filter(review => {
          const id = review._id || review.id;
          return id !== reviewId;
        });
        
        // 更新评论数
        if (this.detail.reviewCount !== undefined) {
          this.detail.reviewCount = Math.max(0, this.detail.reviewCount - 1);
        }
      }
    },
    // 工具方法：格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    
    // 获取推荐菜单
    async fetchRecommendItems(shopId) {
      // 如果没有提供shopId，则返回空数组
      if (!shopId) {
        console.warn('获取推荐菜单时未提供shopId');
        return Promise.resolve([]);
      }
      
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${BASE_API_URL}/coffee-shops/${shopId}/recommended-dishes`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200 && res.data && res.data.code === 0) {
              console.log(`获取咖啡店(${shopId})推荐菜单成功:`, res.data.data);
              this.setRecommendItems(res.data.data);
              resolve(res.data.data);
            } else {
              console.error(`获取咖啡店(${shopId})推荐菜单失败:`, res.data);
              reject(new Error('获取推荐菜单失败: ' + (res.data.message || '未知错误')));
            }
          },
          fail: (err) => {
            console.error(`请求咖啡店(${shopId})推荐菜单接口失败:`, err);
            reject(err);
          }
        });
      });
    },
    // 删除咖啡店方法
    deleteCoffeeShop(coffeeShopId) {
      if (!coffeeShopId) {
        uni.showToast({
          title: '缺少商店ID',
          icon: 'none'
        });
        return Promise.reject(new Error('缺少商店ID'));
      }
      
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '确认删除',
          content: '确定要删除这个咖啡店吗？此操作不可恢复。',
          success: (res) => {
            if (res.confirm) {
              // 用户点击确定，执行删除操作
              uni.showLoading({
                title: '删除中...',
                mask: true
              });
              
              // 发送删除请求
              uni.request({
                url: `${BASE_API_URL}/coffee-shops/${coffeeShopId}`,
                method: 'DELETE',
                success: (res) => {
                  if (res.statusCode === 200) {
                    // 从本地列表中删除
                    const index = this.list.findIndex(item => 
                      (item._id && item._id === coffeeShopId) || 
                      (item.id && item.id === coffeeShopId)
                    );
                    
                    if (index !== -1) {
                      this.list.splice(index, 1);
                    }
                    
                    uni.showToast({
                      title: '删除成功',
                      icon: 'success'
                    });
                    
                    resolve(true);
                  } else {
                    let errorMsg = '删除失败';
                    if (res.data && res.data.message) {
                      errorMsg = res.data.message;
                    }
                    
                    uni.showToast({
                      title: errorMsg,
                      icon: 'none'
                    });
                    
                    reject(new Error(errorMsg));
                  }
                },
                fail: (err) => {
                  console.error('删除咖啡店请求失败:', err);
                  
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
            } else {
              // 用户点击取消，不执行删除
              resolve(false);
            }
          }
        });
      });
    },
    // 添加推荐菜
    async addRecommendedDish(shopId, dishData) {
      if (!shopId) {
        return Promise.reject(new Error('缺少商店ID'));
      }
      
      // 检查必填字段
      if (!dishData.dishName) {
        return Promise.reject(new Error('菜品名称不能为空'));
      }
      
      if (!dishData.dishImage) {
        return Promise.reject(new Error('菜品图片不能为空'));
      }
      
      if (!dishData.price || dishData.price <= 0) {
        return Promise.reject(new Error('菜品价格必须大于0'));
      }
      
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${this.baseApiUrl}/coffee-shops/${shopId}/recommended-dishes`,
          method: 'POST',
          data: dishData,
          header: {
            'Content-Type': 'application/json'
          },
          success: (res) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
              console.log('添加推荐菜成功:', res.data);
              
              // 刷新推荐菜列表
              this.fetchRecommendItems(shopId)
                .then(() => {
                  resolve(res.data);
                })
                .catch(() => {
                  // 即使刷新列表失败，仍然认为添加成功
                  resolve(res.data);
                });
            } else {
              const errMsg = res.data && res.data.message ? res.data.message : '添加失败';
              console.error('添加推荐菜失败:', res.data);
              reject(new Error(errMsg));
            }
          },
          fail: (err) => {
            console.error('添加推荐菜请求失败:', err);
            reject(new Error('网络请求失败'));
          }
        });
      });
    },
    async fetchShopInfo(id) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${this.baseApiUrl}/coffee-shops/${id}`,
          method: 'GET',
          success: (res) => {
            if(res.statusCode === 200 && res.data.success) {
              resolve(res.data.data);
            } else {
              reject(new Error(res.data.message || '获取商店信息失败'));
            }
          },
          fail: (err) => {
            console.error('获取商店信息失败:', err);
            reject(err);
          }
        });
      });
    },
    // 添加咖啡店评论
    async addCoffeeShopReview(shopId, data) {
      if (!shopId) {
        return Promise.reject(new Error('缺少商店ID'));
      }

      // 先取出rating值并确保是有效数字
      let rating = 5; // 默认评分
      if (data.data?.rating !== undefined) {
        rating = parseFloat(data.data.rating);
      } else if (data.rating !== undefined) {
        rating = parseFloat(data.rating);
      }
      
      // 检查rating是否是NaN，如果是则使用默认值
      if (isNaN(rating)) {
        rating = 5;
      }
      
      // 确保rating在合法范围内
      rating = Math.max(1, Math.min(5, rating));

      // 确保数据符合接口要求结构
      const formattedData = {
        userName: data.data?.userName || data.userName || "",
        userAvatar: data.data?.userAvatar || data.userAvatar || "",
        content: data.data?.content || data.content || "",
        rating: rating,
        images: data.data?.images || data.images || []
      };
      
      // 确保必填字段不为空
      if (!formattedData.userName) {
        return Promise.reject(new Error("用户名不能为空"));
      }
      
      if (!formattedData.userAvatar) {
        return Promise.reject(new Error("用户头像不能为空"));
      }
      
      if (!formattedData.content) {
        return Promise.reject(new Error("评价内容不能为空"));
      }
      
      console.log(`提交评价到商店 ${shopId}，数据:`, JSON.stringify(formattedData));
      
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${this.baseApiUrl}/coffee-shops/${shopId}/reviews`,
          method: 'POST',
          data: formattedData,
          header: {
            'Content-Type': 'application/json'
          },
          success: (res) => {
            console.log('评价提交响应:', res);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              // 刷新评论列表
              this.fetchShopReviews(shopId);
              resolve(res.data);
            } else {
              const errMsg = (res.data && res.data.message) || '提交评价失败';
              reject(new Error(errMsg));
            }
          },
          fail: (err) => {
            console.error('评价提交请求失败:', err);
            reject(new Error('网络请求失败'));
          }
        });
      });
    }
  }
}); 