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

### 2. 获取咖啡店详情

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

### 3. 获取咖啡店评论

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

### 4. 添加咖啡店评论

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

### 5. 删除咖啡店评论

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
4. 删除评论需要提供有效的评论ID
5. 图片URL应直接使用，无需额外处理 