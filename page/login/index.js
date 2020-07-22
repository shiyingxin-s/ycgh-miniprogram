const common = require('../../util/common.js')
var loginByCode = require('../../api/loginByCode')
const requestLib = require('../../api/request')
var UserData = require('../../api/userData')
const httpUrl = require('../../config')
import { hexMD5 } from "../../util/md5.js"

const app = getApp()

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 25 ,
    employeeCode: '',
    password: '',
    openId: '',
    isShow: false
  },
  onShow: function () {
    if(!UserData.get() || !UserData.get().openId){
      this.loginByCodeFun()
    } else {
      this.setData({
        openId: UserData.get().openId
      })
    }
  },
  registerClick(){
    wx.navigateTo({
      url:'../register/index'
    })
  },
  forgetPwdClick(){
    wx.navigateTo({
      url:'../forgetPwd/index'
    })
  },
  loginByCodeFun(){
    const wxs = this
    const options = {
      method: 'get',
      success: successFun,
      fail: (error)=>{
        common.showToast(error.errMessage, 3000)
      }
    }
    // 调用登录请求
    loginByCode.login(options)
    function successFun(res){
      wxs.setData({
        openId:res.openId
      })
    }
  },
   
  inputNum(e){
    this.setData({
      employeeCode:e.detail
    })
  },

  inputPwd(e){
    this.setData({
      password: e.detail
    })
  },
   // 表单验证
   verify(){
    let wxs = this
    if(!wxs.data.employeeCode){
      common.showToast('请输入员工编号')
      return false
    } else if(!wxs.data.password){
      common.showToast('请输入密码')
      return false
    } else {
      return true
    }
  },

  // 登录
  loginClick() {
    const wxs = this
    if(wxs.data.isShow){return}
    if(!wxs.verify()){ return }
    wxs.loginFun()
  },

  loginFun(){
    const wxs = this
    wxs.loaddingFun(true)
    let data = {
      employeeCode: wxs.data.employeeCode,
      password: hexMD5(wxs.data.password),
      openId: wxs.data.openId
    }
    requestLib.request({
      url:  httpUrl.login,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        wxs.loaddingFun()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      if(resData && resData.code === 0){
        UserData.set(resData.data)
        wxs.loaddingFun()
        wx.switchTab({
          url: '../tabBar/home/index',
        })
      } else {
        wxs.loaddingFun()
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  loaddingFun(data) {
    const wxs = this
    wxs.setData({
      isShow: data? true: false
    })
  }
})
