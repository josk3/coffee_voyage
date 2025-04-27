# 删除咖啡店 API 接口文档

## 接口描述
该接口用于删除指定ID的咖啡店记录。删除操作不可恢复，调用前应确认。

## 基本信息
- **接口URL**: `/api/coffee-shops/{id}`
- **请求方式**: DELETE
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
  "message": "删除成功",
  "data": {
    "id": "咖啡店ID"
  }
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

## 示例

### 请求示例

```
DELETE /api/coffee-shops/680e4162a0de3adf45a640fe HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

### 成功响应示例

```json
{
  "code": 0,
  "message": "删除成功",
  "data": {
    "id": "680e4162a0de3adf45a640fe"
  }
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

1. 删除操作为不可逆操作，请谨慎调用
2. 删除咖啡店会同时删除与之关联的评论和菜品信息
3. 客户端应处理各种错误情况，包括网络错误、服务器错误等
4. 删除成功后，客户端应当从本地列表中移除对应项目并更新UI

## 前端实现说明

前端删除咖啡店的主要流程:

1. 用户点击删除按钮
2. 显示确认对话框
3. 用户确认后，发送DELETE请求到服务器
4. 请求成功后，从本地状态中移除该咖啡店
5. 通知用户删除成功

```javascript
// 删除咖啡店的示例实现
function deleteCoffeeShop(coffeeShopId) {
  // 显示确认对话框
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个咖啡店吗？此操作不可恢复。',
    success: (res) => {
      if (res.confirm) {
        // 显示加载提示
        uni.showLoading({ title: '删除中...' });
        
        // 发送删除请求
        uni.request({
          url: `${BASE_API_URL}/coffee-shops/${coffeeShopId}`,
          method: 'DELETE',
          success: (res) => {
            if (res.statusCode === 200) {
              // 删除成功，更新本地数据
              // ...
              
              uni.showToast({ title: '删除成功', icon: 'success' });
            } else {
              // 处理错误
              uni.showToast({ 
                title: res.data.message || '删除失败', 
                icon: 'none' 
              });
            }
          },
          fail: (err) => {
            // 处理网络错误
            uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' });
          },
          complete: () => {
            uni.hideLoading();
          }
        });
      }
    }
  });
}
``` 