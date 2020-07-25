const app = getApp()
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 19 ,
       // 组件所需的参数
       nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: '考试回顾', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      data:'',
      paperId:''
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        paperId:options.id
      })
      common.showLoading()
      this.getDataFun()
    } else {
      common.showToast('获取试卷失败', 3000)
      wx.navigateBack()
    }
  },
  // 获取
  getDataFun() {
    const wxs = this
    let data = {
      employeeId: UserData.get().id,
      paperId: wxs.data.paperId
    }
    requestLib.request({
      url:  httpUrl.getRecordDetail,
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
      if(resData && resData.code === 0){
        resData.data.map(item=>{
          item.isDo = true
        })
        wxs.setData({
          data:resData.data
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },
  itemClick(e){
    this.setData({
      type : parseInt(e.currentTarget.dataset.type)
    })
  },
  ok(){
    wx.navigateBack() 
  }
  
})

