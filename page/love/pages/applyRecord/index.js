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
        title: '我的申请', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      dataList: [],
      listQuery:{
        StatusName:'',
      }
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
    common.showLoading()
    this.getDataFun()
  },
  // 获取数据
  getDataFun(param) {
    const wxs = this
    let data = {
      employeeId: UserData.get().id,
    }
    requestLib.request({
      url:  httpUrl.getAidList,
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
          dataList:resData.data
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },
  itemClick(e){
      wx.navigateTo({
        url:'../apply/index?id='+ e.currentTarget.dataset.id
      })
  },
  
})

