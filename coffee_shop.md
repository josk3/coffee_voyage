### 1. 创建咖啡店

创建一个新的咖啡店，包括基本信息、评价和推荐菜品。

- **URL**: `/coffee-shops`
- **方法**: `POST`
- **权限**: 公开

**请求体**:
```json
{
  "data": {
    "shopInfo": {
      "shopName": "LAVAZZA 拉瓦萨咖啡",   // 必填，店铺名称
      "shopImage": "https://example.com/logo.jpg",  // 必填，图片URL
      "rating": 4.5,                     // 选填，评分(1-5)
      "commentCount": 2,                 // 选填，评价数
      "averagePrice": 32,                // 必填，人均价格
    },
    "comments": [
      {
        "userName": "张三",               // 必填，用户姓名
        "userAvatar": "https://example.com/avatar1.jpg", // 必填，评价者头像
        "content": "环境很好,服务员很热情,推荐大家来" // 必填，评价内容
      }
    ],
    "recommendDishes": [
      {
        "dishName": "冰吸生椰拿铁",        // 必填，菜品名称
        "dishImage": "https://example.com/dish1.jpg", // 必填，菜品图片
        "price": 32,                     // 必填，菜品价格
        "recommendIndex": 5,             // 选填，推荐指数(1-5)
        "description": "使用优质椰浆和阿拉比卡咖啡豆制作" // 选填，菜品描述
      }
    ]
  }
}
```

**字段说明**:

* shopInfo：店铺基本信息
  - shopName: 店铺名称，必填
  - shopImage: 店铺图片URL，必填
  - rating: 店铺评分，选填，默认5
  - commentCount: 评价数量，选填，默认为comments数组长度
  - averagePrice: 人均价格，必填
  - address: 店铺地址，选填
  - businessHours: 营业时间，选填

* comments: 店铺评价数组，选填
  - userName: 用户名称，必填
  - userAvatar: 用户头像URL，必填
  - content: 评价内容，必填
  - images: 评价图片数组，选填

* recommendDishes: 推荐菜品数组，选填
  - dishName: 菜品名称，必填
  - dishImage: 菜品图片URL，必填
  - price: 菜品价格，必填
  - recommendIndex: 推荐指数，选填，默认5
  - description: 菜品描述，选填

**响应数据**:
```json
{
  "code": 0,
  "message": "咖啡店创建成功",
  "data": {
    "shopId": "60d5ec9af682fbd12a0041a7",
    "name": "LAVAZZA 拉瓦萨咖啡",
    "reviewIds": [
      "61d5ec9af682fbd12a0041d5",
      "61d5ec9af682fbd12a0041d6"
    ],
    "dishIds": [
      "62d5ec9af682fbd12a0041e1",
      "62d5ec9af682fbd12a0041e2"
    ]
  }
}
```