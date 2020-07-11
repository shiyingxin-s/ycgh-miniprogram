

Page({
  data: {
  },

  // 登录
  loginClick() {
    wx.switchTab({
      url: '../tabBar/home/index',
    })
  },
  registerClick(){
    wx.navigateTo({
      url:'../register/index'
    })
  }

})
