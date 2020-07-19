
const app = getApp()
const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 19 ,
      // 组件所需的参数
      nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '网上练兵', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    type: 0,
    toPath: '',
    resData: '',
      
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../login/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   this.getDataFun()
  },

  // 获取每日十题状态
  getDataFun() {
    const wxs = this
    let data = {
      employeeId: UserData.get().id,
    }
    requestLib.request({
      url:  httpUrl.getEverDayResult,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      if(resData && resData.code === 0){
       wxs.setData({
        resData:resData.data
       })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  itemClick(e){
    this.setData({
      type : parseInt(e.currentTarget.dataset.type),
      toPath: e.currentTarget.dataset.path
    })
    if(this.data.toPath){
      wx.navigateTo({
        url: this.data.toPath
      })
    }
  },
  toEveryDay(){
    if(this.data.resData){
      common.showToast('今日任务已完成', 3000)
      return
    }
    wx.navigateTo({
      url:'../../answer/pages/everyDay/index'
    })
  }
})

