const app = getApp()
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')

Page({
  data: {
    listH: app.globalData.whHeight - 200,
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 19 ,
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '成绩统计', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    loadMore:false,
    totalScore: 0,
    data:[]
   
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
    common.showLoading()
    this._getList()
  },
  // 
  _getList() {
    const wxs = this
    let data = {
      employeeId: UserData.get().id,
    }
    requestLib.request({
      url:  httpUrl.getAchievement,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      common.hideLoading()
      if(resData && resData.code === 0){
        let count = 0
        if(!resData.data){return}
        resData.data.map(item=>{
           return count = count + parseInt(item.Score)
        })
        wxs.setData({
          data: {...resData.data},
          totalScore: count
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  
})

