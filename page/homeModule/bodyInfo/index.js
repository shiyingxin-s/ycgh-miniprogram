// page/homeModule/bodyInfo/index.js

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
    sex: '', // 'M' 男，'F' 女
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

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 选择男女事件
  itemClick(e){
    var sexData = e.currentTarget.dataset.sex
    this.setData({
      sex: sexData
    })
  },
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
    if(!wxs.data.sex){
        common.showToast('请选择性别')
        return false
    } else if(!wxs.data.heightParm){
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
    wx.redirectTo({
      url:'../fitness/index'
    })
  }

})