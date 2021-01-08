// page/homeModule/fitness/index.js

const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')
const util = require('../../../util/util.js')
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
    reportPhone: '',
    activeIndex: 0,
    activeName: '塑形',
    classList:[ '塑形', '增肌', '瑜伽' ],

    buttonStatus: 1, // 1 : 不范围内，2 : 打卡，3 : 签退 

    loadMore:false,
    pageIndex:1,
    pageSize:10,
    dataList:[],

    // 鸿海大厦 坐标
    latitude: 34.22259,
    longitude: 108.94878,

    // 我家 坐标(华洲城天峰)
    latitude: 34.244569,
    longitude: 108.849042,

    // 鱼化寨地铁口
    latitude: 34.237931,
    longitude: 108.848668,

    // 当前定位坐标
    lat:34.237931,
    long:108.848668
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocationFun()
    this.setData({
      reportPhone: UserData.get()?UserData.get().reportPhone:''
    })
    // this.getRunData()
    common.showLoading()
    this.getDataList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 获取当前位置
  getLocationFun() {
    const wxs = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const resKm = util.getDistance(
          res.latitude,
          res.longitude,
          wxs.data.lat,
          wxs.data.long
        )
        wxs.setData({
          buttonStatus: resKm <= 100 ? 2 : 1
        })
      }
     })
  },
  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageIndex = this.data.pageIndex
    this.setData({
      loadMore: true,
      pageIndex: ++pageIndex
    })
    this.getDataList()
  },
  getDataList() {
    const wxs = this
    let data = {
      // employeeId: UserData.get().id,
      pageIndex: wxs.data.pageIndex,
      pageSize: wxs.data.pageSize,
      itemCode: wxs.data.activeName,
    }
    requestLib.request({
      url:  httpUrl.getFitnessVideo,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      common.hideLoading()
      const resData = res.data
      if(resData && resData.code === 0){
        if(wxs.data.loadMore){
          let list = wxs.data.dataList
          if(resData.data.length>0){
            list = list.concat(resData.data)
          }
          wxs.setData({
            dataList: list,
            loadMore:false
          })
        } else{
          wxs.setData({
            dataList: resData.data
          })
        }
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },

  onChange(e){
    var wxs = this
    wxs.setData({
      activeName: e.detail.title,
      activeIndex: e.detail.index,
      loadMore:false,
      pageIndex:1,
      pageSize:10,
    })
    common.showLoading()
    wxs.getDataList()
  },
  getRunData(){
    var wxs = this
    wx.getWeRunData({
      success (res) {
        // 拿 encryptedData 到开发者后台解密开放数据
        const encryptedData = res.encryptedData
        // 或拿 cloudID 通过云调用直接获取开放数据
        const cloudID = res.cloudID
      }
    })
    
  },

  
})