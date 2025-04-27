# 咖啡店应用API文档

## 基础信息

- 基础URL: `http://localhost:3000/api`
- 所有响应格式均为JSON
- 标准响应格式:
  ```json
  {
    "success": true/false,
    "message": "成功/错误消息",
    "data": 返回的数据
  }
  ```

## 咖啡店接口

### 1. 获取咖啡店列表

获取咖啡店列表，支持分页查询。

- **URL**: `/coffee-shops`
- **方法**: `GET`
- **权限**: 公开

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 | 默认值 |
|--------|------|------|------|--------|
| page | Number | 否 | 当前页码 | 1 |
| limit | Number | 否 | 每页数量 | 10 |

**响应数据**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "_id": "60d5ec9af682fbd12a0041a5",
        "name": "LAVAZZA 拉瓦萨咖啡",
        "logo": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
        "rating": 4.5,
        "reviewCount": 3,
        "price": 32,
        "reviewer": {
          "id": "101",
          "name": "用户1",
          "avatar": "https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp",
          "reviewText": "环境很好,服务员很热情,推荐大家来"
        }
      },
      // 更多咖啡店...
    ]
  }
}
```

### 2. 创建咖啡店

创建一个新的咖啡店。

- **URL**: `/coffee-shops`
- **方法**: `POST`
- **权限**: 管理员

**请求体**:
```json
{
  "name": "星巴克咖啡",                // 必填，咖啡店名称
  "logo": "https://example.com/logo.jpg", // 必填，咖啡店logo图片URL
  "rating": 4.5,                      // 必填，初始评分
  "reviewCount": 0,                   // 选填，初始评价数量
  "price": 35,                        // 必填，人均价格
  "address": "广州市天河区天河路123号", // 选填，地址
  "businessHours": "周一至周日 9:00-22:00", // 选填，营业时间
  "description": "提供高品质咖啡体验", // 选填，描述
  "images": [                         // 选填，店铺图片
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "initialReview": {                  // 选填，初始评价
    "userName": "张三",               // 用户名称
    "userAvatar": "https://example.com/avatar.jpg", // 用户头像
    "text": "环境很好，咖啡味道不错"  // 评价内容
  }
}
```

**响应数据**:
```json
{
  "success": true,
  "message": "咖啡店创建成功",
  "data": {
    "_id": "64a5ec9af682fbd12a0041a6",
    "name": "星巴克咖啡",
    "logo": "https://example.com/logo.jpg",
    "rating": 4.5,
    "reviewCount": 1,
    "price": 35,
    "address": "广州市天河区天河路123号",
    "businessHours": "周一至周日 9:00-22:00",
    "description": "提供高品质咖啡体验",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "createdAt": "2024-07-01T08:30:45.123Z"
  }
}
```

### 3. 获取咖啡店详情

根据ID获取特定咖啡店的详细信息，包括评论。

- **URL**: `/coffee-shops/:id`
- **方法**: `GET`
- **权限**: 公开

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| id | String | 咖啡店ID |

**响应数据**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": "60d5ec9af682fbd12a0041a5",
    "name": "瑞幸咖啡",
    "logo": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
    "rating": 4.0,
    "reviewCount": 3,
    "price": 15,
    "images": [
      "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
      "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
      "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg"
    ],
    "address": "广州市天河区",
    "businessHours": "周一至周日 10:00-22:00",
    "description": "",
    "reviews": [
      {
        "name": "用户8",
        "avatar": "https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp",
        "rating": 5,
        "date": "2024-03-01",
        "text": "性价比超高，味道也不错",
        "images": [
          "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg"
        ]
      },
      {
        "name": "用户9",
        "avatar": "https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp",
        "rating": 3.5,
        "date": "2024-03-10",
        "text": "外带方便，但店内座位太少",
        "images": []
      },
      {
        "name": "匿名用户",
        "avatar": "https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp",
        "rating": 3.5,
        "date": "2024-02-26",
        "text": "在食堂里面开的，没啥服务，做好了自己拿就行，味道还可以，价格还行，提神醒脑来一杯",
        "images": [
          "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg"
        ]
      }
    ]
  }
}
```

### 4. 获取咖啡店评论

获取特定咖啡店的所有评论。

- **URL**: `/coffee-shops/:shopId/reviews`
- **方法**: `GET`
- **权限**: 公开

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| shopId | String | 咖啡店ID |

**响应数据**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "_id": "60d5ec9af682fbd12a0041b1",
      "userId": "108",
      "userName": "用户8",
      "userAvatar": "https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp",
      "rating": 5,
      "content": "性价比超高，味道也不错",
      "images": [
        "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg"
      ],
      "createdAt": "2024-03-01T00:00:00.000Z"
    },
    // 更多评论...
  ]
}
```

### 5. 添加咖啡店评论

为特定咖啡店添加新评论。

- **URL**: `/coffee-shops/:shopId/reviews`
- **方法**: `POST`
- **权限**: 公开

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| shopId | String | 咖啡店ID |

**请求体**:
```json
{
  "userId": "user123",      // 可选
  "userName": "张三",       // 必填，用户昵称
  "userAvatar": "https://example.com/avatar.jpg",  // 必填，用户头像
  "rating": 4.5,            // 必填，评分
  "content": "咖啡很香，环境也很舒适",  // 必填，评论内容
  "images": [               // 可选，评论图片
    "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg"
  ]
}
```

**响应数据**:
```json
{
  "success": true,
  "message": "评论添加成功",
  "data": {
    "reviewId": "64a5ec9af682fbd12a0041c3",
    "shopId": "60d5ec9af682fbd12a0041a5",
    "userName": "张三",
    "userAvatar": "https://example.com/avatar.jpg",
    "rating": 4.5,
    "content": "咖啡很香，环境也很舒适",
    "images": [
      "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg"
    ],
    "createdAt": "2024-07-01T08:30:45.123Z"
  }
}
```

### 6. 删除咖啡店评论

删除特定咖啡店的评论。

- **URL**: `/coffee-shops/:shopId/reviews/:reviewId`
- **方法**: `DELETE`
- **权限**: 公开

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| shopId | String | 咖啡店ID |
| reviewId | String | 评论ID |

**响应数据**:
```json
{
  "success": true,
  "message": "评论删除成功",
  "data": {
    "reviewId": "64a5ec9af682fbd12a0041c3",
    "shopId": "60d5ec9af682fbd12a0041a5",
    "deletedAt": "2024-07-01T09:15:30.456Z"
  }
}
```

## 推荐菜品接口

### 1. 获取推荐菜品列表

获取所有推荐菜品或特定咖啡店的推荐菜品。

- **URL**: `/recommended-dishes`
- **方法**: `GET`
- **权限**: 公开

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 | 默认值 |
|--------|------|------|------|--------|
| shopId | String | 否 | 咖啡店ID，如果提供则只返回该店铺的推荐菜品 | 无 |
| page | Number | 否 | 当前页码 | 1 |
| limit | Number | 否 | 每页数量 | 10 |

**响应数据**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "_id": "65d5ec9af682fbd12a0041a5",
        "shopId": "60d5ec9af682fbd12a0041a5",
        "name": "小黄油拿铁",
        "image": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
        "price": 32,
        "rating": 4.8,
        "description": "采用优质小黄油，口感丝滑",
        "createdAt": "2024-03-01T00:00:00.000Z"
      },
      {
        "_id": "65d5ec9af682fbd12a0041a6",
        "shopId": "60d5ec9af682fbd12a0041a5",
        "name": "费尔岛拿铁",
        "image": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
        "price": 35,
        "rating": 4.6,
        "description": "选用费尔岛咖啡豆，香气四溢",
        "createdAt": "2024-03-10T00:00:00.000Z"
      }
      // 更多推荐菜品...
    ]
  }
}
```

### 2. 添加推荐菜品

为咖啡店添加推荐菜品。

- **URL**: `/coffee-shops/:shopId/dishes`
- **方法**: `POST`
- **权限**: 管理员

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| shopId | String | 咖啡店ID |

**请求体**:
```json
{
  "name": "太妃榛香拿铁",          // 必填，菜品名称
  "image": "https://example.com/dish.jpg", // 必填，菜品图片URL
  "price": 36,                   // 必填，菜品价格
  "rating": 4.8,                 // 必填，推荐指数(1-5)
  "description": "口感香浓，带有榛子香气" // 选填，菜品描述
}
```

**响应数据**:
```json
{
  "success": true,
  "message": "推荐菜品添加成功",
  "data": {
    "_id": "66d5ec9af682fbd12a0041a7",
    "shopId": "60d5ec9af682fbd12a0041a5",
    "name": "太妃榛香拿铁",
    "image": "https://example.com/dish.jpg",
    "price": 36,
    "rating": 4.8,
    "description": "口感香浓，带有榛子香气",
    "createdAt": "2024-07-01T08:30:45.123Z"
  }
}
```

### 3. 获取推荐菜品详情

获取特定推荐菜品的详细信息。

- **URL**: `/recommended-dishes/:dishId`
- **方法**: `GET`
- **权限**: 公开

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| dishId | String | 推荐菜品ID |

**响应数据**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "_id": "65d5ec9af682fbd12a0041a5",
    "shopId": "60d5ec9af682fbd12a0041a5",
    "name": "小黄油拿铁",
    "image": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
    "price": 32,
    "rating": 4.8,
    "description": "采用优质小黄油，口感丝滑",
    "shopInfo": {
      "_id": "60d5ec9af682fbd12a0041a5",
      "name": "LAVAZZA 拉瓦萨咖啡"
    },
    "createdAt": "2024-03-01T00:00:00.000Z"
  }
}
```

### 4. 删除推荐菜品

删除特定推荐菜品。

- **URL**: `/coffee-shops/:shopId/dishes/:dishId`
- **方法**: `DELETE`
- **权限**: 管理员

**路径参数**:

| 参数名 | 类型 | 描述 |
|--------|------|------|
| shopId | String | 咖啡店ID |
| dishId | String | 推荐菜品ID |

**响应数据**:
```json
{
  "success": true,
  "message": "推荐菜品删除成功",
  "data": {
    "dishId": "65d5ec9af682fbd12a0041a5",
    "shopId": "60d5ec9af682fbd12a0041a5",
    "deletedAt": "2024-07-01T09:15:30.456Z"
  }
}
```

## 错误码说明

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 (需要登录) |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 前端集成注意事项

1. 咖啡店详情页应使用 `/coffee-shops/:id` 接口获取完整数据
2. 评论列表已包含在详情接口中，无需单独请求
3. 添加评论接口无需用户登录，但必须提供用户昵称和头像
4. 添加咖啡店和推荐菜品需要管理员权限
5. 图片URL应直接使用，无需额外处理 