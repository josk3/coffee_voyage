# 添加推荐菜API文档

## 接口说明

该接口用于向咖啡店添加新的推荐菜品。

## 基本信息

- **接口URL**: `/coffee-shops/{shopId}/recommended-dishes`
- **请求方式**: POST
- **Content-Type**: application/json

## 请求参数

### 路径参数

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| shopId | String | 是 | 咖啡店ID |

### 请求体参数

| 参数名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| dishName | String | 是 | 菜品名称 |
| dishImage | String | 是 | 菜品图片URL |
| price | Number | 是 | 菜品价格 |
| recommendIndex | Number | 否 | 推荐指数(1-5)，默认为5 |
| description | String | 否 | 菜品描述 |

## 请求示例

```json
{
  "dishName": "摩卡咖啡",
  "dishImage": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
  "price": 28,
  "recommendIndex": 5,
  "description": "浓郁的摩卡咖啡，搭配丝滑牛奶，口感醇厚"
}
```

## 响应参数

### 成功响应

| 参数名 | 类型 | 描述 |
| ----- | ---- | ---- |
| code | Number | 状态码，0表示成功 |
| data | Object | 新创建的推荐菜品信息 |
| message | String | 成功提示信息 |

### 成功响应示例

```json
{
  "code": 0,
  "data": {
    "id": "dish123456",
    "dishName": "摩卡咖啡",
    "dishImage": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
    "price": 28,
    "recommendIndex": 5,
    "description": "浓郁的摩卡咖啡，搭配丝滑牛奶，口感醇厚",
    "createTime": "2023-04-20T08:30:00Z"
  },
  "message": "添加推荐菜成功"
}
```

### 错误响应

| 参数名 | 类型 | 描述 |
| ----- | ---- | ---- |
| code | Number | 状态码，非0值表示错误 |
| message | String | 错误提示信息 |

### 错误响应示例

```json
{
  "code": 400,
  "message": "菜品名称不能为空"
}
```

## 可能的错误码

| 错误码 | 描述 |
| ----- | ---- |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 权限不足 |
| 404 | 咖啡店不存在 |
| 500 | 服务器内部错误 |

## 对接Store实现

在`src/stores/coffeeShop.js`中的实现方式如下：

```javascript
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
}
```

## 页面调用示例

在页面组件中调用Store的方法：

```javascript
import { useCoffeeShopStore } from '@/stores/coffeeShop';

const coffeeShopStore = useCoffeeShopStore();

// 新推荐菜表单数据
const newDish = ref({
  name: '',
  image: 'https://example.com/default-image.jpg',
  price: 0,
  recommendIndex: 5,
  description: ''
});

// 提交新推荐菜
const submitNewDish = () => {
  // 构建请求数据
  const requestData = {
    dishName: newDish.value.name,
    dishImage: newDish.value.image,
    price: Number(newDish.value.price),
    recommendIndex: Number(newDish.value.recommendIndex),
    description: newDish.value.description
  };
  
  // 调用store方法添加推荐菜
  coffeeShopStore.addRecommendedDish(shopId.value, requestData)
    .then(() => {
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      });
      
      // 其他操作...
    })
    .catch(err => {
      uni.showToast({
        title: err.message || '添加失败',
        icon: 'none'
      });
    });
};
``` 