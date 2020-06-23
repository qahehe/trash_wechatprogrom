//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.4.1或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env:"trash-t2q0q"
        //云开发环境
      })
    }

  },
  globalData: {
  }
})
