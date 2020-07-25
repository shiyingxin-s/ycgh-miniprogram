const app = getApp()
const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 25 ,
       // 组件所需的参数
       nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: '个人中心', //导航栏 中间的标题,
        isBackPer: false, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      data:''
   
  },
  onShow: function () {
    if(!UserData.get() || !UserData.get().openId ){
      wx.redirectTo({
        url: '../../login/index'
      })
      return
    }
    common.showLoading()
    this.getDataFun()
  },
   // 获取数据
   getDataFun() {
    const wxs = this
    let data = {
      EmployeeId:UserData.get().id,
    }
    requestLib.request({
      url:  httpUrl.getPersonalInfo,
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
  /**
   * 获取用户 -- 昵称、头像
   * @param {*} e 
   */
  getUserInfo: function(e) {
    var wxs = this
    let userInfo = e.detail.userInfo
    common.showLoading()
    wxs.saveFun(userInfo)
  },

  saveFun(data){
    const wxs = this
    requestLib.request({
      url:  httpUrl.saveWxInfo,
      method: 'post',
      data: {
        employeeId:UserData.get().id,
        wxNickName:data.nickName,
        wxPhoto:data.avatarUrl
      },
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      if(resData && resData.code === 0){
       wxs.getDataFun()
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },
  toPath(e){
    if(e.currentTarget.dataset.path){
      wx.navigateTo({
        url: e.currentTarget.dataset.path+'?name='+'my'
      })
    }
  }
   
})
