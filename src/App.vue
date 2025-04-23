<script>
export default {
  globalData: {
    tempData: {},
    shopInfo: null  // 存储店铺信息
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
    console.log('App Show')
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
