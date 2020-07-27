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
        title: '我的成绩', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      pageIndex:1,
      pageSize:10,
      loadMore:false,

      data:'',
      list: [],
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // common.showLoading()
    this._getList()
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
    this._getList()
  },
  // 
  _getList() {
    const wxs = this
    let data = {
      employeeId: UserData.get().id,
      pageIndex: wxs.data.pageIndex,
      pageSize: wxs.data.pageSize
    }
    requestLib.request({
      url:  httpUrl.getExamRecords,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        // common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      if(resData && resData.code === 0){
        wxs.setData({
          data: resData.data? {...resData.data}: ''
        })
        if(wxs.data.loadMore){
          let list = wxs.data ? wxs.data.list: []
          list.push(resData.data?resData.data.records:[])
          wxs.setData({
            list: list,
            loadMore:false
          })
        }else{
          let list = resData.data?resData.data.records:[]
          wxs.setData({
            list: list
          })
        }
      } else {
        common.showToast(error.errMessage, 3000)
      }
      // common.hideLoading()
    }
  },
  gotoDetail(e){
    wx.navigateTo({
      url:'../examReview/index?id='+ e.currentTarget.dataset.id
    }) 
  },
  
})

