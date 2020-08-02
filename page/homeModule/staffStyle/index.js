
const app = getApp()
const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

Page({
  data: {
      // 此页面 页面内容距最顶部的距离
      height: app.globalData.navHeight * 2 + 19 ,
      conHeight: app.globalData.whHeight - (app.globalData.navHeight * 2 + 19) - 80,
      // 组件所需的参数
      nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '职工风采', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    activeKey: 0,
    typeList:[],     
   
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
  onLoad: function () {
   common.showLoading()
   this.getDataFun()
  },

  //
  getDataFun() {
    const wxs = this
    requestLib.request({
      url:  httpUrl.getSelectMajor,
      method: 'post',
      data: {enCode:'StaffStyle'},
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
        if(resData.data.length>0){
          resData.data.push({id:'add', text: ''},{id: 'my', text:'我的上传'})
        }
        wxs.setData({
          typeList:resData.data
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  onChange(e) {
    let index = e.detail
    let name = this.data.typeList[index].id
    if(name === 'add'){
      wx.navigateTo({
        url:'../../staffStyle/pages/add/index'
      })  
    }
   
  },
  
})

