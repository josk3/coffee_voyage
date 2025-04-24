/**
 * 页面混入
 */
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      error: null,
      page: 1,
      limit: 10,
      hasMore: true
    };
  },
  
  computed: {
    ...mapState({
      home: state => state.home,
      course: state => state.course,
      category: state => state.category,
      album: state => state.album,
      coffeeShop: state => state.coffeeShop,
      user: state => state.user
    })
  },
  
  methods: {
    ...mapActions([
      'fetchHomeData',
      'fetchCourseList',
      'fetchCourseDetail',
      'fetchCourseComments',
      'fetchCategoryList',
      'fetchCategoryDetail',
      'fetchCategoryCourses',
      'fetchAlbumList',
      'fetchAlbumDetail',
      'fetchAlbumCourses',
      'fetchCoffeeShopList',
      'fetchCoffeeShopDetail',
      'fetchCoffeeShopReviews',
      'fetchUserProfile',
      'updateUserProfile'
    ]),
    
    // 显示加载提示
    showLoading(title = '加载中...') {
      uni.showLoading({
        title,
        mask: true
      });
    },
    
    // 隐藏加载提示
    hideLoading() {
      uni.hideLoading();
    },
    
    // 显示错误提示
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      });
    },
    
    // 显示成功提示
    showSuccess(message) {
      uni.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      });
    },
    
    // 处理错误
    handleError(error) {
      console.error(error);
      this.error = error.message || '操作失败';
      this.showError(this.error);
      
      // 如果是未授权错误，跳转到登录页
      if (error.code === 401) {
        uni.navigateTo({
          url: '/pages/auth/login'
        });
      }
    },
    
    // 加载更多数据
    async loadMore() {
      if (this.loading || !this.hasMore) return;
      
      try {
        this.loading = true;
        this.page++;
        
        // 根据当前页面类型加载数据
        switch (this.$options.name) {
          case 'CourseList':
            await this.fetchCourseList({
              page: this.page,
              limit: this.limit
            });
            break;
            
          case 'CategoryCourses':
            await this.fetchCategoryCourses({
              id: this.categoryId,
              params: {
                page: this.page,
                limit: this.limit
              }
            });
            break;
            
          case 'AlbumCourses':
            await this.fetchAlbumCourses({
              id: this.albumId,
              params: {
                page: this.page,
                limit: this.limit
              }
            });
            break;
            
          case 'CoffeeShopList':
            await this.fetchCoffeeShopList({
              page: this.page,
              limit: this.limit
            });
            break;
        }
        
        // 检查是否还有更多数据
        const list = this.getCurrentList();
        this.hasMore = list.length >= this.limit;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    
    // 获取当前列表数据
    getCurrentList() {
      switch (this.$options.name) {
        case 'CourseList':
          return this.course.list;
        case 'CategoryCourses':
          return this.category.courses;
        case 'AlbumCourses':
          return this.album.courses;
        case 'CoffeeShopList':
          return this.coffeeShop.list;
        default:
          return [];
      }
    },
    
    // 下拉刷新
    async onPullDownRefresh() {
      try {
        this.page = 1;
        this.hasMore = true;
        
        // 根据当前页面类型刷新数据
        switch (this.$options.name) {
          case 'Home':
            await this.fetchHomeData();
            break;
            
          case 'CourseList':
            await this.fetchCourseList({
              page: this.page,
              limit: this.limit
            });
            break;
            
          case 'CategoryCourses':
            await this.fetchCategoryCourses({
              id: this.categoryId,
              params: {
                page: this.page,
                limit: this.limit
              }
            });
            break;
            
          case 'AlbumCourses':
            await this.fetchAlbumCourses({
              id: this.albumId,
              params: {
                page: this.page,
                limit: this.limit
              }
            });
            break;
            
          case 'CoffeeShopList':
            await this.fetchCoffeeShopList({
              page: this.page,
              limit: this.limit
            });
            break;
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        uni.stopPullDownRefresh();
      }
    },
    
    // 上拉加载更多
    onReachBottom() {
      this.loadMore();
    }
  }
}; 