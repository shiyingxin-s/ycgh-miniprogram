
var UserData = require('../../api/userData')
Page({
  data: {
  },

  onLoad: function () {
  },
  // 欢迎页消失
  onShow: function(){
    if(UserData.get() && UserData.get().openId && UserData.get().id){
      setTimeout(function () {
        wx.switchTab({
          url: '../tabBar/home/index'
        })
      }, 1020) 
    } else {
      setTimeout(function () {
        wx.redirectTo({
          url: '../login/index'
        })
      }, 1020) 
    }
  },
})
