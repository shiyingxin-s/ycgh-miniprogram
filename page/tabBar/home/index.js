const app = getApp()
var UserData = require('../../../api/userData')

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 19 ,
       // 组件所需的参数
       nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: '首页', //导航栏 中间的标题,
        isBackPer: false, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!UserData.get() || !UserData.get().openId ){
      wx.redirectTo({
        url: '../../login/index'
      })
    }
  },
  toAnswer(){
    let toPath = '../../homeModule/answer/index'
    if(!UserData || !UserData.get().professionId ){
      toPath = '../../homeModule/selectProfession/index'
    } 
    wx.navigateTo({
      url: toPath
    })
  },
  toLibrary(){
    wx.navigateTo({
      url: '../../homeModule/library/index'
    })
  },
  toLoveHelp(){
    wx.navigateTo({
      url: '../../homeModule/loveHelp/index'
    })
  }
})

