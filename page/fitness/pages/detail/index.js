// page/staffLecture/pages/detail/index.js
const app = getApp()
const httpUrl = require('../../../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.navHeight * 2 + 19 ,
    // 组件所需的参数
    nvabarData: {
     showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
     title: '全民运动', //导航栏 中间的标题,
     isBackPer: true, //不显示返回按钮,
     bgColor:'#f4424a' //导航背景色
   },
    urlVideo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     urlVideo: httpUrl.host + options.url
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})