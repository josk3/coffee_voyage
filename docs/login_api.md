# 咖啡旅申城小程序 - API接口文档

## 基础信息

- **基础URL**: `https://febbvyhkbfrt.sealoshzh.site/v1`
- **请求方式**: 除非特别说明，所有接口均使用POST方式
- **数据格式**: JSON
- **编码方式**: UTF-8
- **认证方式**: 登录后的接口采用JWT Token认证，在请求头中添加 `Authorization: Bearer {token}`

## 错误码说明

| 错误码 | 描述 | 处理建议 |
| ----- | ---- | ------- |
| 0 | 成功 | 请求成功处理 |
| 10001 | 参数错误 | 检查请求参数是否符合要求 |
| 20001 | 微信授权失败 | 请重新授权 |
| 20002 | 获取手机号失败 | 检查phoneCode是否有效 |
| 20003 | 登录凭证无效 | 请重新登录 |
| 20004 | 账号已被封禁 | 请联系客服 |
| 30001 | 系统维护中 | 请稍后再试 |

## 接口列表

### 1. 微信登录

**接口描述**: 通过微信登录code获取用户身份并返回登录凭证(token)，可选提供phoneCode获取用户手机号

**请求路径**: `/auth/wx-login`

**请求方式**: POST

**请求头**: 无需认证

**请求参数**:

| 参数名 | 类型 | 必须 | 描述 |
| ----- | ---- | ---- | ---- |
| code | String | 是 | 微信登录临时凭证(通过uni.login获取) |
| phoneCode | String | 否 | 获取用户手机号的授权code(通过getPhoneNumber事件获取) |

**请求示例**:

```json
{
  "code": "061Cn71w3fWcM74WE53w3zZkv63Cn712",
  "phoneCode": "9d63f1af125fafe54687"
}
```

**成功响应**:

状态码: 200 OK

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 2592000,
    "user": {
      "userId": "64f5a1b5c3e2d26d8f279abc",
      "openid": "oWm1v5JcJJJfEOKn0QG9AQ2pI",
      "nickName": "用户_ABCDEF",
      "avatarUrl": null,
      "gender": 0,
      "phone": "13800138000",
      "isPhoneVerified": true
    },
    "isNewUser": false
  }
}
```

**失败响应**:

1. **参数错误**:

状态码: 400 Bad Request

```json
{
  "code": 10001,
  "message": "参数错误：缺少code"
}
```

2. **微信授权失败**:

状态码: 401 Unauthorized

```json
{
  "code": 20001,
  "message": "微信授权失败，请重新授权"
}
```

3. **系统错误**:

状态码: 500 Internal Server Error

```json
{
  "code": 30001,
  "message": "系统维护中，请稍后再试"
}
```

### 2. 退出登录

**接口描述**: 用户退出登录

**请求路径**: `/auth/logout`

**请求方式**: POST

**请求头**: 

```
Authorization: Bearer {token}
```

**请求参数**: 无

**成功响应**:

状态码: 200 OK

```json
{
  "code": 0,
  "message": "退出成功"
}
```

**失败响应**:

1. **未认证或Token无效**:

状态码: 401 Unauthorized

```json
{
  "code": 20003,
  "message": "登录凭证无效，请重新登录"
}
```

2. **Token已过期**:

状态码: 401 Unauthorized

```json
{
  "code": 20003,
  "message": "登录凭证已过期，请重新登录"
}
```

3. **账号被封禁**:

状态码: 403 Forbidden

```json
{
  "code": 20004,
  "message": "账号已被封禁，请联系客服"
}
```

## 客户端调用示例

### UniApp微信登录示例代码

```javascript
// 获取微信登录凭证
uni.login({
  provider: 'weixin',
  success: function(loginRes) {
    // loginRes.code是临时登录凭证
    console.log("微信登录成功，临时凭证：", loginRes.code);
    
    // 直接使用code登录，不获取手机号
    callLoginApi(loginRes.code);
  },
  fail: function(err) {
    console.error("微信登录失败", err);
    uni.showToast({ title: '微信登录失败，请重试', icon: 'none' });
  }
});

// 获取用户手机号（需要在button上设置open-type="getPhoneNumber"）
// 在button的点击事件中调用
function getPhoneNumber(e) {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    const phoneCode = e.detail.code;
    // 获取登录凭证
    uni.login({
      provider: 'weixin',
      success: function(loginRes) {
        // 将code和phoneCode一起发送到后端
        callLoginApi(loginRes.code, phoneCode);
      }
    });
  } else {
    uni.showToast({ title: '您拒绝了授权获取手机号', icon: 'none' });
    // 用户拒绝授权，仅使用code进行登录
    uni.login({
      provider: 'weixin',
      success: function(loginRes) {
        callLoginApi(loginRes.code);
      }
    });
  }
}

// 调用登录接口
function callLoginApi(code, phoneCode = null) {
  const data = { code };
  if (phoneCode) {
    data.phoneCode = phoneCode;
  }
  
  uni.request({
    url: 'https://febbvyhkbfrt.sealoshzh.site/v1/auth/wx-login',
    method: 'POST',
    data: data,
    success: function(res) {
      if (res.data.code === 0) {
        // 存储token
        uni.setStorageSync('token', res.data.data.token);
        // 存储用户信息
        uni.setStorageSync('userInfo', res.data.data.user);
        // 跳转到首页或其他页面
        uni.switchTab({ url: '/pages/index/index' });
      } else {
        uni.showToast({ title: res.data.message, icon: 'none' });
      }
    },
    fail: function(err) {
      console.error("登录请求失败", err);
      uni.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  });
}
```

### 获取手机号按钮示例

```html
<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号快捷登录</button>
```

### 请求接口时携带Token示例

```javascript
// 通用请求函数
function request(url, method, data, needToken = true) {
  return new Promise((resolve, reject) => {
    const header = {};
    
    if (needToken) {
      const token = uni.getStorageSync('token');
      if (!token) {
        // 未登录，跳转到登录页
        uni.navigateTo({ url: '/pages/login/login' });
        return reject(new Error('未登录'));
      }
      header.Authorization = `Bearer ${token}`;
    }
    
    uni.request({
      url: `https://febbvyhkbfrt.sealoshzh.site/v1${url}`,
      method: method,
      data: data,
      header: header,
      success: function(res) {
        if (res.data.code === 0) {
          // 请求成功
          resolve(res.data);
        } else if (res.data.code === 20003) {
          // token无效或过期，跳转到登录页
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          uni.navigateTo({ url: '/pages/login/login' });
          reject(new Error(res.data.message));
        } else {
          // 其他错误
          uni.showToast({ title: res.data.message, icon: 'none' });
          reject(new Error(res.data.message));
        }
      },
      fail: function(err) {
        uni.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

// 使用示例：退出登录
function logout() {
  request('/auth/logout', 'POST', {}, true)
    .then(res => {
      // 清除本地存储
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      // 跳转到登录页
      uni.reLaunch({ url: '/pages/login/login' });
    })
    .catch(err => {
      console.error('退出登录失败:', err);
    });
}
```

## 微信授权手机号流程说明

微信获取用户手机号有特定的流程要求：

1. 需要用户主动点击获取手机号按钮（open-type="getPhoneNumber"）
2. 获取到的不是手机号，而是临时授权凭证code
3. 需要将该凭证发送到后端，后端再通过微信接口获取实际手机号
4. 获取手机号需要小程序已认证

流程如下：
1. 用户点击获取手机号按钮
2. 微信弹出授权框
3. 用户同意授权后，前端获取到phoneCode
4. 前端调用登录接口，同时传入login code和phone code
5. 后端通过phone code换取用户手机号
6. 后端将手机号与用户信息关联并返回登录结果

## 注意事项

1. 所有接口均采用HTTPS协议，确保数据传输安全
2. token有效期为30天，前端需处理token过期情况
3. 获取手机号功能需要小程序已认证
4. 首次登录用户将自动注册，使用随机昵称
5. 获取用户手机号需要用户主动点击授权按钮
6. 开发者应遵循微信的隐私保护规范和用户数据安全要求
7. 获取手机号的能力需要在微信公众平台的"开发"->"接口设置"中申请

## 调试建议

1. 使用Postman等工具进行接口测试
2. 确保微信AppID和AppSecret正确配置
3. 本地开发时，可使用代理工具进行内网穿透，便于小程序调试
4. 记录并分析请求日志，以便排查问题
5. 微信小程序开发者工具中启用"不校验合法域名"选项进行本地调试
6. 真机调试时需要将API域名添加到小程序的合法域名中 