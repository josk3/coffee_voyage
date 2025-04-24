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
    }
  }
}); 