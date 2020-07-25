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
            title: '消息中心', //导航栏 中间的标题,
            isBackPer: true, //不显示返回按钮,
            bgColor:'#f4424a' //导航背景色
        },
        list:'',
        activeNames:'',
        
    },
    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function () {
        common.showLoading()
        this.getDataFun()
    },
    onShow: function () {
        if(!UserData || !UserData.get().token ){
            wx.redirectTo({
              url: '../../login/index'
            })
          }
    },
    // 获取数据
    getDataFun() {
        const wxs = this
        let data = {
            EmployeeId:UserData.get().id,
            Id: wxs.data.id,
        }
        requestLib.request({
            url:  httpUrl.getMessages,
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
                    list:resData.data
                })
            } else {
                common.showToast(error.errMessage, 3000)
            }
            common.hideLoading()
        }
    },
    onChange(e) {
        this.setData({
            activeNames: e.detail
        })
        let status = e.currentTarget.dataset.status
        if(!status){
           this.updateStatus(e.detail[0])
        }
    },

    updateStatus(data){
        const wxs = this
        requestLib.request({
            url:  httpUrl.setMessageStatus,
            method: 'post',
            data: { messageId: data },
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
    }
})
