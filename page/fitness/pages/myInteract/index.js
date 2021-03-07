// page/fitness/pages/myInteract/index.js
const app = getApp()
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.navHeight * 2 + 19 ,
    // 组件所需的参数
    nvabarData: {
     showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
     title: '我的贡献', //导航栏 中间的标题,
     isBackPer: true, //不显示返回按钮,
     bgColor:'#f4424a' //导航背景色
   },
    
   activeIndex: 0,
   activeName: '减脂',


   noMore:false,
   loadMore:false,
   loading: false,

   pageIndex:1,
   pageSize:10,
   datas:{},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   common.showLoading()
  //   this.getData()
  // },
  onShow: function() {
    common.showLoading()
    this.getData()
  },
  getData() {
    const wxs = this
    let data = {
      employeeId: UserData.get().id
    }
    requestLib.request({
      url:  httpUrl.getPersonalFerver,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      common.hideLoading()
      const resData = res.data
      if(resData && resData.code === 0){
        wxs.setData({
          datas: resData.data
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },


  toDetail(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url:'../detail/index?url=' + url 
    })
  },
  uploadBtn() {
    wx.navigateTo({
      url:'../uploadFile/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  del(e){
    const wxs = this
    let id = e.currentTarget.dataset.id
    let data = {
      id: id,
    }
    common.showLoading()
    requestLib.request({
      url:  httpUrl.deletePersonalTeching,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      common.hideLoading()
      const resData = res.data
      if(resData && resData.code === 0){
        common.showLoading()
        wxs.getData()
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  }

 
})