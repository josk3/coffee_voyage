<script>
export default {
  globalData: {
    tempData: {},
    shopInfo: null  // 存储店铺信息
  },
  onLaunch: function () {
    console.log('App Launch')
    
    // 检查用户是否登录
    const token = uni.getStorageSync('token');
    const userInfo = uni.getStorageSync('userInfo');
    
    if (!token || !userInfo) {
      console.log('用户未登录，跳转到登录页');
      // 使用setTimeout延迟跳转，确保应用完全初始化
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }, 100);
    } else {
      console.log('用户已登录:', userInfo);
    }
    
    // 其他初始化代码
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      env:'cloud1-9g6v9uwp225ed706'
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
  @import url("static/iconfonts/iconfont.wxss");
</style>
