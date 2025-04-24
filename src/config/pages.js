/**
 * 页面路由配置
 */
export const pages = {
  // 首页
  home: {
    path: '/pages/home/index',
    title: '首页'
  },
  
  // 课程相关
  course: {
    list: {
      path: '/pages/course/list',
      title: '课程列表'
    },
    detail: {
      path: '/pages/course/detail',
      title: '课程详情'
    }
  },
  
  // 分类相关
  category: {
    list: {
      path: '/pages/category/list',
      title: '分类列表'
    },
    detail: {
      path: '/pages/category/detail',
      title: '分类详情'
    }
  },
  
  // 专辑相关
  album: {
    list: {
      path: '/pages/album/list',
      title: '专辑列表'
    },
    detail: {
      path: '/pages/album/detail',
      title: '专辑详情'
    }
  },
  
  // 咖啡店相关
  coffeeShop: {
    list: {
      path: '/pages/coffee-shop/list',
      title: '咖啡店列表'
    },
    detail: {
      path: '/pages/coffee-shop/detail',
      title: '咖啡店详情'
    }
  },
  
  // 用户相关
  user: {
    profile: {
      path: '/pages/user/profile',
      title: '个人中心'
    },
    settings: {
      path: '/pages/user/settings',
      title: '设置'
    }
  },
  
  // 认证相关
  auth: {
    login: {
      path: '/pages/auth/login',
      title: '登录'
    },
    register: {
      path: '/pages/auth/register',
      title: '注册'
    }
  }
};

/**
 * 页面跳转方法
 */
export const navigateTo = (page) => {
  uni.navigateTo({
    url: page.path
  });
};

export const redirectTo = (page) => {
  uni.redirectTo({
    url: page.path
  });
};

export const switchTab = (page) => {
  uni.switchTab({
    url: page.path
  });
};

export const reLaunch = (page) => {
  uni.reLaunch({
    url: page.path
  });
};

export const navigateBack = (delta = 1) => {
  uni.navigateBack({
    delta
  });
}; 