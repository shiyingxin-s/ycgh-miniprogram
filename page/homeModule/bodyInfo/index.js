// page/homeModule/bodyInfo/index.js

const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 19 ,
      // 组件所需的参数
      nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '全民健身', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    sex: UserData.get()?UserData.get().sex:'', // 'M' 男，'F' 女
    heightParm: '',
    weightParm:'',
    professionId: '123',
    selectId: -1,
    fromName: '',
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromName: options.name
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../page/login/index'
      })
    }
  },
  // 选择男女事件
  // itemClick(e){
  //   var sexData = e.currentTarget.dataset.sex
  //   this.setData({
  //     sex: sexData
  //   })
  // },
  inputHeight(e) {
    this.setData({
      heightParm: e.detail
    })
  },
  inputWeight(e) {
    this.setData({
      weightParm: e.detail
    })
  },
  // 表单验证
  verify(){
    let wxs = this
    if(!wxs.data.heightParm){
        common.showToast('请输入身高')
        return false
    } else if(!wxs.data.weightParm){
        common.showToast('请输入体重')
        return false
    } else {
    return true
    }
  },
  // 
  btnClick() {
    if(!this.verify()){ return }
    this.saveFun()
  },
  loaddingFun(data) {
    const wxs = this
    wxs.setData({
      isShow: data? true: false
    })
  },
  saveFun() {
    const wxs = this
    wxs.loaddingFun(true)
    let data = {
      employeeId: UserData.get().id,
      height: this.data.heightParm,
      weight: this.data.weightParm
    }
    requestLib.request({
      url:  httpUrl.setBodyConfig,
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
          userData.height = wxs.data.heightParm
          userData.weight = wxs.data.weightParm
          UserData.set(userData)
          if(wxs.data.fromName){
            common.showToast('设置成功', 3000)
            setTimeout(()=>{
              wx.navigateBack()
            },1000)
          } else {
            wx.redirectTo({
              url:'../fitness/index'
            })
          }
        } else {
          common.showToast('设置失败', 3000)
        }
      } else {
        common.showToast(error.errMessage, 3000)
      }
      wxs.loaddingFun()
    }
  }

  
})