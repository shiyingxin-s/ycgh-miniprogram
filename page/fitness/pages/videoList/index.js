// page/fitness/pages/videoList/index.js
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')
import Dialog from '../../../../dist/dialog/dialog'
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
      title: '健身互动', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    isShow:false,

    reportPhone: '', // 机关单位可健身

    activeIndex: 0,
    activeName: '减脂',


    noMore:false,
    loadMore:false,
    loading: false,

    pageIndex:1,
    pageSize:10,
    dataList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // this.getRunData()
    common.showLoading()
    this.getDataList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      reportPhone: UserData.get()?UserData.get().reportPhone:'',
      unsignId: UserData.get()? UserData.get().unsignId:'',
      endTime: UserData.get()?UserData.get().endTime: '',
    })
  },

  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageIndex = this.data.pageIndex
    this.setData({
      loadMore: true,
      pageIndex: ++pageIndex,
      loading:true
    })
    this.getDataList()
  },
  getDataList() {
    const wxs = this
    let data = {
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
        wxs.setData({
          noMore: resData.data.list.length === 0 ? true: false
        })
        if(wxs.data.loadMore){
          let list = wxs.data.dataList
          if(resData.data.list.length>0){
            list = list.concat(resData.data.list)
          }
          wxs.setData({
            dataList: list,
            loadMore:false,
            loading:false
          })
        } else{
          wxs.setData({
            dataList: resData.data.list,
            loading:false
          })
        }
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },


  loaddingFun(data) {
    const wxs = this
    wxs.setData({
      isShow: data? true: false
    })
  },

  // 保存观看记录
  play() {
    requestLib.request({
      url:  httpUrl.saveFitnessVedio,
      method: 'post',
      data: {employeeId: UserData.get().id},
      success: (res)=>{ },
      fail: (error)=>{ }
    })
  },
  toDetail(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url:'../detail/index?url=' + url 
    })
  },
  
})