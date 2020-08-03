const app = getApp()
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 19 ,
    conHeight: app.globalData.whHeight - (app.globalData.navHeight * 2 + 19) - 20,
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '职工风采', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    index: -1,
    datas:'',
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.showLoading()
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一个页面
    this.setData({
      index:options.index,
      datas: prevPage.data.dataList[options.index]
    })
    console.log(this.data.datas)
    common.hideLoading()
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
  },
 
  
})

