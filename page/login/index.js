const common = require('../../util/common.js')
var loginByCode = require('../../api/loginByCode')
const requestLib = require('../../api/request')
var UserData = require('../../api/userData')
const httpUrl = require('../../config')
import { hexMD5 } from "../../util/md5.js"

Page({
  data: {
    employeeCode: '',
    password: '',
    openId: ''
  },
  onShow: function () {
    this.loginByCodeFun()
  },
  registerClick(){
    wx.navigateTo({
      url:'../register/index'
    })
  },
  loginByCodeFun(){
    const options = {
      method: 'get',
      success: (res)=>{
        this.setData({
          openId:res.openid
        })
      },
      fail: (error)=>{
        common.showToast(error.errMessage, 3000)
      }
    }
    // 调用登录请求
    loginByCode.login(options)
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
    if(!wxs.verify()){ return }
    wxs.loginFun()
  },

  loginFun(){
    const wxs = this
    let data = {
      employeeCode: wxs.data.employeeCode,
      password: hexMD5(wxs.data.password),
      openId: wxs.data.openId
    }
    requestLib.request({
      url:  httpUrl.login+'/?employeeCode=001&password=123&openId=123',
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
        UserData.set(resData)
        wx.switchTab({
          url: '../tabBar/home/index',
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
})
