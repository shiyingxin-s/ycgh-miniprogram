
const app = getApp()
const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 19 ,
       // 组件所需的参数
       nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: '身份选择', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      professionId: '',
      selectId: -1,
      dataList: []
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../login/index'
      })
    }
  },
  onLoad:function(){
    this.getDataFun()
  },
  // 获取类型
  getDataFun() {
    const wxs = this
    let data = {
      enCode: 'ProfessionType',
    }
    requestLib.request({
      url:  httpUrl.getSelectMajor,
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
       wxs.setData({
        dataList:resData.data
       })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  itemClick(e){
    this.setData({
      professionId: e.currentTarget.dataset.professionid,
      selectId: parseInt(e.currentTarget.dataset.id)
    })
  },
  // 设置选择
  btnClick(){
   if(!this.data.professionId || this.data.isShow ){ return }
   this.selectFun()
  },

  selectFun() {
    const wxs = this
    wxs.loaddingFun(true)
    let data = {
      employeeId: UserData.get().id,
      professionId: wxs.data.professionId,//具体专业key
    }
    requestLib.request({
      url:  httpUrl.setProfession,
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
        if(resData.data){
          let userData = UserData.get()
          userData.professionId = wxs.data.professionId
          UserData.set(userData)
          wx.navigateTo({
            url:'../answer/index'
          })
        } else {
          common.showToast('进入失败', 3000)
        }
      } else {
        common.showToast(error.errMessage, 3000)
      }
      wxs.loaddingFun()
    }
  },

  loaddingFun(data) {
    const wxs = this
    wxs.setData({
      isShow: data? true: false
    })
  }
})

