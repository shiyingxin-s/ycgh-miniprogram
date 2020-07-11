const common = require('../../util/common.js')
const requestLib = require('../../api/request')
var loginByCode = require('../../api/loginByCode')
var UserData = require('../../api/userData')
const httpUrl = require('../../config')
import { hexMD5 } from "../../util/md5.js"


Page({
  data: {
    employeeCode: '',
    password: '',
    openId: '',
    employName: '',
    confirmPwd:''
  },

  onShow() {
    if(!UserData || !UserData.get().openid){
      common.showToast('请输入员工编号')
      this.loginByCodeFun()
    } else {
      this.setData({
        openId: UserData.get().openid
      })
    }
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

  inputName(e){
    this.setData({
      employName:e.detail
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
    if(!wxs.data.employName){
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
      common.showToast('输去密码与确认密码不一致')
      return false
    } else {
      return true
    }
  },
  // 注册
  register() {
    const wxs = this
    if(!wxs.verify()){ return }
    wxs.registerFun()
  },
  registerFun(){
    const wxs = this
    let data = {
      employeeCode: wxs.data.employeeCode,
      password: hexMD5(wxs.data.password),
      openId: wxs.data.openId,
      employName: wxs.data.employName
    }
    requestLib.request({
      url:  httpUrl.register,
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
        common.showToast('注册成功', 3000)
        setTimeout(()=>{
          wx.navigateBack()
        },1000)
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },

})
