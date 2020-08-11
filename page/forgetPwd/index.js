const common = require('../../util/common.js')
const requestLib = require('../../api/request')
var loginByCode = require('../../api/loginByCode')
var UserData = require('../../api/userData')
const httpUrl = require('../../config')
import { hexMD5 } from "../../util/md5.js"
const app = getApp()

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 25 ,
     // 组件所需的参数
     nvabarData: {
       showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
       title: '忘记密码', //导航栏 中间的标题,
       isBackPer: true, //不显示返回按钮,
       bgColor:'#f4424a' //导航背景色
     },

    employeeCode: '',
    password: '',
    openId: '',
    employeeName: '',
    confirmPwd:'',
    isShow: false
  },

  onShow() {
    if(!UserData || !UserData.get().openId){
      this.loginByCodeFun()
    } else {
      this.setData({
        openId: UserData.get().openId
      })
    }
  },
  loginByCodeFun(){
    const options = {
      method: 'get',
      success: (res)=>{
        this.setData({
          openId:res.openId
        })
      },
      fail: (error)=>{
        common.showToast(error.errMessage, 3000)
      }
    }
    // 调用登录请求
    loginByCode.login(options)
  },

  inputName(e){
    this.setData({
      employeeName:e.detail
    })
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
  inputCPwd(e){
    this.setData({
      confirmPwd: e.detail
    })
  },

  // 表单验证
  verify(){
    let wxs = this
    if(!wxs.data.employeeName){
      common.showToast('请输入姓名')
      return false
    } else if(!wxs.data.employeeCode){
      common.showToast('请输入员工工号')
      return false
    } else if(!(/^[0-9]{6}$/.test(wxs.data.password))){
      common.showToast('密码必须为数字，且长度为6位')
      return false
    } else if(!wxs.data.password){
      common.showToast('请输入密码')
      return false
    } else if(!wxs.data.confirmPwd){
      common.showToast('请输入确认密码')
      return false
    } else if(wxs.data.confirmPwd !== wxs.data.password){
      common.showToast('输入密码与确认密码不一致')
      return false
    } else {
      return true
    }
  },
  // 
  btnOk() {
    const wxs = this
    if(wxs.data.isShow){return}
    if(!wxs.verify()){ return }
    wxs.btnOkFun()
  },
  btnOkFun(){
    const wxs = this
    wxs.loaddingFun(true)
    let data = {
      employeeCode: wxs.data.employeeCode,
      password: hexMD5(wxs.data.password),
      openId: wxs.data.openId,
      employeeName: wxs.data.employeeName
    }
    requestLib.request({
      url:  httpUrl.setPassword,
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
        UserData.set(resData)
        common.showToast('重置成功，请返回重新登录', 3000)
        wxs.loaddingFun()
        setTimeout(()=>{
          wx.navigateBack()
        },1000)
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
