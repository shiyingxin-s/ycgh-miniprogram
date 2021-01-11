
const app = getApp()
const requestLib = require('../../../api/request')
var UserData = require('../../../api/userData')
const httpUrl = require('../../../config')
const common = require('../../../util/common.js')

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 19 ,
    conHeight: app.globalData.whHeight - (app.globalData.navHeight * 2 + 19) - 20,
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '职工风采', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    goActiveKey: 0,
    activeKey: 0,
    typeList:[], 

    // noMore:false,
    // loadMore:false,
    // loading: false,

    // pageIndex:1,
    // pageSize:10,
    dataList:[],
    typeCode: '' ,
    
    
    scroll: {
      // 设置分页信息
      pagination: {
        page: 1,
        totalPage: 0,
        limit: 10,
        length: 0
      },
      // 设置数据为空时的图片
      empty: {
        img: '/image/pic_quexing.png'
      },
      // 设置下拉刷新
      refresh: {
        type: 'default',
        style: 'black',
        background: "#000"
      },
      // 设置上拉加载
      loadmore: {
        type: 'default',
        icon: 'http://upload-images.jianshu.io/upload_images/5726812-95bd7570a25bd4ee.gif',
        // background: '#f2f2f2', 
        title: {
          show: true,
          text: '加载中',
          color: "#999",
          shadow: 5
        }
      } 

    }
   
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../page/login/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   this.setData({
     goActiveKey: 0
   })
   common.showLoading()
   this.getDataFun()
  },

  //
  getDataFun() {
    const wxs = this
    requestLib.request({
      url:  httpUrl.getSelectMajor,
      method: 'post',
      data: {enCode:'StaffStyle'},
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
        if(resData.data.length>0){
          resData.data.push({id:'add', text: ''},{id: 'my', text:'我的上传'})
        }
        wxs.setData({
          typeList:resData.data,
          typeCode: resData.data[wxs.data.goActiveKey].id,
          activeKey: wxs.data.goActiveKey
        })
        common.showLoading()
        wxs.getDataList('refresh')
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },

  // 下拉 刷新 页数设置1
  refresh: function () {
    this.getDataList('refresh')
  },
  // 上拉 加载 页数设置+1
  loadMore: function () {
    this.getDataList('loadMore')
  }, 
  getDataList(type) {
    const wxs = this
    let scroll = wxs.data.scroll
    scroll.pagination.page = type == 'refresh' ? 1 : scroll.pagination.page + 1
    wxs.setData({
      dataList: type == 'refresh'? []: wxs.data.dataList,
      'scroll.pagination.page': scroll.pagination.page
    })
    let data = {
      employeeId: UserData.get().id,
      pageIndex: wxs.data.scroll.pagination.page,
      pageSize: wxs.data.scroll.pagination.limit,
      typeCode: wxs.data.typeCode,
    }
    requestLib.request({
      url:  httpUrl.getStaffStyle,
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
        
        resData.data.list.map(item=>{
          let list = item.Pictures? item.Pictures.split('||'):[]
          item.fileType = item.AttachementUrl? (item.AttachementUrl.split('.'))[1] : ''
          item.AttachementUrl = httpUrl.host + item.AttachementUrl
          item.imageList= list.map(n=>{
            n = httpUrl.host + n
            return n
          })
        })
        let list = wxs.data.dataList
        if(resData.data.list.length>0){
          list = list.concat(resData.data.list)
        }
        wxs.setData({
          dataList: list,
          'scroll.pagination.length': resData.data.pages.totalCount,
          'scroll.pagination.totalPage': resData.data.pages.totalPage
        })
        // 数据加载完隐藏loadmore
        wxs.selectComponent(".scroll-box").loadEnd()
        
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  onChange(e) {
    const wxs = this
    let index = e.detail
    let name = this.data.typeList[index].id
    wxs.setData({
      goActiveKey: index,
      typeCode: name
    })
    common.showLoading()
    wxs.getDataList('refresh')
    if(name === 'add'){
      wx.navigateTo({
        url:'../../staffStyle/pages/add/index'
      })  
    }
   
  },
  goDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'../../staffStyle/pages/detail/index?id='+id
    })  
  },
  // 点赞或取消点赞
  upateLike(e){
    const wxs = this
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let data = {
      employeeId: UserData.get().id,
      id: id,
      isLike: type === 'like'? true :false
    }
    common.showLoading()
    requestLib.request({
      url:  httpUrl.staffStyleLike,
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
        common.showLoading()
        wxs.getDataList('refresh')
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
  del(e){
    const wxs = this
    let id = e.currentTarget.dataset.id
    let data = {
      id: id,
    }
    common.showLoading()
    requestLib.request({
      url:  httpUrl.deleteStyle,
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
        common.showLoading()
        wxs.getDataList('refresh')
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  }
})

