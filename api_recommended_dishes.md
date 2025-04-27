# 获取咖啡店推荐菜品 API 接口文档

## 接口描述
该接口用于获取指定咖啡店ID的推荐菜品列表。

## 基本信息
- **接口URL**: `/api/coffee-shops/{id}/recommended-dishes`
- **请求方式**: GET
- **接口认证**: 无需认证

## 请求参数

### 路径参数

| 参数名 | 类型   | 必选 | 描述           |
|--------|--------|------|----------------|
| id     | string | 是   | 咖啡店的唯一ID |

### 请求头

| 名称          | 类型   | 必选 | 描述                            |
|---------------|--------|------|--------------------------------|
| Content-Type  | string | 是   | 固定值: `application/json`     |

## 响应参数

### 成功响应
**状态码**: 200 OK

```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": "菜品ID",
      "name": "菜品名称",
      "image": "菜品图片URL",
      "price": 38.5,
      "recommendIndex": 5,
      "description": "菜品描述文本",
      "shopId": "所属咖啡店ID"
    },
    // ... 更多菜品
  ]
}
```

### 失败响应
**状态码**: 400/404/500 等

```json
{
  "code": 错误码,
  "message": "错误详情描述"
}
```

### 错误码说明

| 错误码 | 说明                 |
|--------|----------------------|
| 1001   | 参数错误             |
| 1002   | 咖啡店不存在         |
| 1003   | 数据库操作失败       |
| 1004   | 服务器内部错误       |

## 响应字段说明

| 字段名         | 类型    | 描述                                 |
|----------------|---------|--------------------------------------|
| id             | string  | 菜品唯一标识                         |
| name           | string  | 菜品名称                             |
| image          | string  | 菜品图片URL                          |
| price          | number  | 菜品价格                             |
| recommendIndex | number  | 推荐指数(1-5)                        |
| description    | string  | 菜品描述                             |
| shopId         | string  | 所属咖啡店ID                         |

## 示例

### 请求示例

```
GET /api/coffee-shops/680e4162a0de3adf45a640fe/recommended-dishes HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

### 成功响应示例

```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": "d001",
      "name": "拿铁咖啡",
      "image": "https://example.com/latte.jpg",
      "price": 32,
      "recommendIndex": 5,
      "description": "香浓醇厚的意式拿铁，奶泡绵密",
      "shopId": "680e4162a0de3adf45a640fe"
    },
    {
      "id": "d002",
      "name": "提拉米苏",
      "image": "https://example.com/tiramisu.jpg",
      "price": 38,
      "recommendIndex": 4,
      "description": "经典意式甜点，口感丰富",
      "shopId": "680e4162a0de3adf45a640fe"
    }
  ]
}
```

### 失败响应示例

```json
{
  "code": 1002,
  "message": "咖啡店不存在"
}
```

## 注意事项

1. 如果咖啡店不存在，将返回404状态码
2. 如果咖啡店存在但没有推荐菜品，将返回空数组，而不是错误
3. 客户端应处理各种错误情况，包括网络错误、服务器错误等

## 前端实现说明

前端获取推荐菜品的主要流程:

```javascript
// 获取咖啡店推荐菜品的示例实现
function fetchRecommendedDishes(shopId) {
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
}
``` 