# Coffee Shop API 文档

## 基本信息

- **API 基础 URL**: `http://localhost:3000/api`
- **数据格式**: JSON

## 接口列表

### 获取所有咖啡店

- **URL**: `/coffee-shops`
- **方法**: GET
- **描述**: 获取所有咖啡店的信息。
- **响应示例**:
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "LAVAZZA 拉瓦萨咖啡",
      "logo": "https://www.coffeestyle.info/data/upload/site_2/item/2024/04/13/661a9b9b87313.jpg",
      "rating": 4.5,
      "reviewCount": 5,
      "price": 32,
      "reviewer": {
        "id": "101",
        "name": "用户1",
        "avatar": "https://p26-passport.byteacctimg.com/img/user-avatar/c69497bf05b49fdabafd3974319accc4~100x100.awebp"
      },
      "reviewText": "环境很好,服务员很热情,推荐大家来",
      "location": {
        "longitude": 116.397128,
        "latitude": 39.916527
      },
      "coverImage": "https://example.com/cover/lavazza.jpg",
      "address": "北京市东城区"
    },
    // ... 其他咖啡店数据
  ]
  ```

## 注意事项

1. **必需字段**: 确保每个咖啡店数据包含 `location.longitude`、`location.latitude`、`coverImage` 和 `address` 字段。
2. **数据格式**: 所有响应数据均为 JSON 格式。
3. **错误处理**: 如果请求失败，服务器将返回相应的错误信息和状态码。
4. **数据更新**: 如果需要更新咖啡店数据，请确保数据库连接正常，并使用正确的 API 端点进行操作。

## 版本信息

- **当前版本**: 1.0.0
- **最后更新**: 2023年10月

请确保前端开发人员根据以上信息正确对接 API。 