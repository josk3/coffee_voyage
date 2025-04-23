<script>
export default {
  globalData: {
    tempData: {},
    shopInfo: null,  // 存储店铺信息
    hasCheckedLogin: false // 登录检查状态
  },
  onLaunch: function () {
    console.log('App Launch');
    
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      env:'cloud1-9g6v9uwp225ed706'
    })
  },
  onShow: function () {
    console.log('App Show');
    // 登录拦截：首次进入且未登录，则跳转到登录页面
    if (!this.globalData.hasCheckedLogin) {
      this.globalData.hasCheckedLogin = true;
      const token = uni.getStorageSync('token');
      if (!token) {
        // 使用不带返回按钮的登录页面
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
  @import url("static/iconfonts/iconfont.wxss");
</style>
