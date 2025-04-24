import { defineStore } from 'pinia';

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
        const response = await fetch('http://localhost:3000/api/coffee-shops');
        if (!response.ok) throw new Error('Failed to fetch coffee shops');
        const data = await response.json();
        this.setCoffeeShopList(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
}); 