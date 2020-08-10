
const app = getApp()
const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 19 ,
     conHeight: app.globalData.whHeight - (app.globalData.navHeight * 2 + 19),
      // 组件所需的参数
      nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '职工书屋', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    htmlText: '',
      
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../page/login/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  saveImage(e){
    let url = e.currentTarget.dataset.url;
    wx.saveImageToPhotosAlbum({
        filePath:url,
        success(res) { 
          common.showToast('已保存至相册',3000)
        },
        fail(res){
          common.showToast('二维码下载失败，请重试或截屏保存',3000)
        }
      })
  }
})

