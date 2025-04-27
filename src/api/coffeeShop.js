/**
 * 咖啡店相关API服务
 */
import request from '@/utils/request';

/**
 * 获取咖啡店列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getCoffeeShops = (params) => {
  return request.get('/coffee-shops', params);
};

/**
 * 获取咖啡店详情
 * @param {String} id - 咖啡店ID
 * @returns {Promise}
 */
export const getCoffeeShop = (id) => {
  return request.get(`/coffee-shops/${id}`);
};

/**
 * 创建咖啡店
 * @param {Object} data - 咖啡店数据
 * @returns {Promise}
 */
export const createCoffeeShop = (data) => {
  // 确保数据符合接口要求结构
  const formattedData = {
    data: {
      shopInfo: {
        shopName: data.shopName || "",  // 必填，店铺名称
        shopImage: data.shopImage || "", // 必填，图片URL
        rating: data.rating || 5,     // 选填，默认5
        commentCount: data.commentCount || 0, // 选填
        averagePrice: data.averagePrice || 0, // 必填，人均价格
        address: data.address || "",   // 选填
        businessHours: data.businessHours || "" // 选填
      },
      comments: Array.isArray(data.comments) ? data.comments.map(comment => ({
        userName: comment.userName || "",
        userAvatar: comment.userAvatar || "",
        content: comment.content || ""
      })) : [],
      recommendDishes: Array.isArray(data.recommendDishes) ? data.recommendDishes.map(dish => ({
        dishName: dish.dishName || "",       // 必填，菜品名称
        dishImage: dish.dishImage || "",     // 必填，菜品图片
        price: dish.price || 0,              // 必填，菜品价格
        recommendIndex: dish.recommendIndex || 5, // 选填，推荐指数
        description: dish.description || ""  // 选填，菜品描述
      })) : []
    }
  };
  
  // 确保必填字段非空
  if (!formattedData.data.shopInfo.shopName) {
    throw new Error("店铺名称不能为空");
  }
  
  if (!formattedData.data.shopInfo.shopImage) {
    throw new Error("店铺图片不能为空");
  }
  
  if (!formattedData.data.shopInfo.averagePrice) {
    throw new Error("人均价格不能为空");
  }
  
  // 检查推荐菜品是否完整
  if (formattedData.data.recommendDishes.length > 0) {
    for (const dish of formattedData.data.recommendDishes) {
      if (!dish.dishName) {
        throw new Error("菜品名称不能为空");
      }
      if (!dish.dishImage) {
        throw new Error("菜品图片不能为空");
      }
      if (!dish.price) {
        throw new Error("菜品价格不能为空");
      }
    }
  }
  
  console.log("提交的咖啡店数据:", JSON.stringify(formattedData));
  
  return request.post('/coffee-shops', formattedData);
};

/**
 * 获取咖啡店评论
 * @param {String} shopId - 咖啡店ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getCoffeeShopReviews = (shopId, params) => {
  return request.get(`/coffee-shops/${shopId}/reviews`, params);
};

/**
 * 添加咖啡店评论
 * @param {String} shopId - 咖啡店ID
 * @param {Object} data - 评论数据
 * @returns {Promise}
 */
export const addCoffeeShopReview = (shopId, data) => {
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
    // 直接使用uni.request以便详细记录请求情况
    uni.request({
      url: `http://localhost:3000/api/coffee-shops/${shopId}/reviews`,
      method: 'POST',
      data: formattedData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('评价提交响应:', res);
        if (res.statusCode >= 200 && res.statusCode < 300) {
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
};

export default {
  getCoffeeShops,
  getCoffeeShop,
  getCoffeeShopReviews,
  addCoffeeShopReview,
  createCoffeeShop
}; 