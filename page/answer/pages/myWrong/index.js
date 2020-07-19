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
        title: '我的错题', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      data: [],
   
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
    this.getDataFun()
  },
  // 提交考试
  submit(e){
    let data = {...e.detail}
    let listData = data.list.map(item=>{
      item.Options = item.Options.filter(n=>{
        return !!n.myCheck
      })
      return item
    })
    let param = {
      employeeId: UserData.get().id,
      paperId: data.paperId,
      data: listData
    }
    this.submitFun(param)
  },
  // 提交考试结果接口
  submitFun(data){
    const wxs = this
    requestLib.request({
      url:  httpUrl.saveExamResult,
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
        this.setData({
          isSubmit: true,
          'nvabarData.title':'成绩单'
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },


  // 获取
  getDataFun() {
    const wxs = this
    let data = {
      employeeId: UserData.get().id,
    }
    requestLib.request({
      url:  httpUrl.getWrongRecords,
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

