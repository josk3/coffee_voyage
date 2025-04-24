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
    }
  }
}); 