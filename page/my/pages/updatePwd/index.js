const app = getApp()
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')
import { hexMD5 } from "../../../../util/md5.js"

Page({
    data: {
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.navHeight * 2 + 19 ,
        // 组件所需的参数
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
            title: '修改密码', //导航栏 中间的标题,
            isBackPer: true, //不显示返回按钮,
            bgColor:'#f4424a' //导航背景色
        },
        password: '',
        newPwd:'',
        confirmPwd:'',
        isShow: false
        
    },
   
    onShow: function () {
        if(!UserData || !UserData.get().token ){
            wx.redirectTo({
                url: '../../../../page/login/index'
            })
          }
    },
    inputOldPwd(e){
        this.setData({
            password: e.detail
        })
    },
    inputNewPwd(e){
        this.setData({
            newPwd: e.detail
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
        if(!wxs.data.password){
            common.showToast('请输入旧密码')
            return false
        } else if(!wxs.data.newPwd){
            common.showToast('请输入新密码')
            return false
        } else if(!(/^[0-9]{6}$/.test(wxs.data.newPwd))){
            common.showToast('密码必须为数字，且长度为6位')
            return false
        }else if(!wxs.data.confirmPwd){
            common.showToast('请输入确认新密码')
            return false
        } else if(wxs.data.confirmPwd !== wxs.data.newPwd){
            common.showToast('输入新密码与确认新密码不一致')
            return false
        } else {
        return true
        }
    },
    save(){
        const wxs = this
        if(wxs.data.isShow){return}
        if(!wxs.verify()){ return }
        wxs.updatePwd()
    },
    // 获取数据
    updatePwd() {
        const wxs = this
        let data = {
            employeeId:UserData.get().id,
            password: hexMD5(wxs.data.password),
            newPwd: hexMD5(wxs.data.newPwd)
        }
        requestLib.request({
        url:  httpUrl.resetPassword,
        method: 'post',
        data: data,
        success: successFun,
        fail: (error)=>{
            common.hideLoading()
            wxs.loaddingFun()
            common.showToast(error.errMessage, 3000)
        }
        })
        function successFun(res){
            const resData = res.data
            if(resData && resData.code === 0){
                UserData.clear()
                common.showToast('修改成功，请重新登录', 3000)
                setTimeout(()=>{
                    wx.redirectTo({
                        url: '../../../../page/login/index'
                    })
                },1000)
            } else {
                common.showToast(error.errMessage, 3000)
            }
            wxs.loaddingFun()
            common.hideLoading()
        }
    },
    loaddingFun(data) {
        const wxs = this
        wxs.setData({
          isShow: data? true: false
        })
      }
})
