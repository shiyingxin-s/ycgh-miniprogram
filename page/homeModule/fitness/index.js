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
    isShow:false,

    reportPhone: '', // 机关单位可健身
    unsignId:'', // 是否签到了
    endTime:'', // 是否签退了

    activeIndex: 0,
    activeName: '塑形',
    classList:[ '塑形', '增肌', '瑜伽' ],

    buttonStatus: 1, // 1 : 不范围内，2 : 打卡，3 : 签退 , 0 : 不显示

    noMore:false,
    loadMore:false,
    loading: false,

    pageIndex:1,
    pageSize:10,
    dataList:[],

    // 鸿海大厦 坐标
    h_latitude: 34.22259,
    h_longitude: 108.94878,

    // 我家 坐标(华洲城天峰)
    m_latitude: 34.2456016540, 
    m_longitude: 108.84353637,

    // 鱼化寨地铁口
    yu_latitude: 34.237931,
    yu_longitude: 108.848668,

    // 康乐中心 ---  游泳馆
    y_latitude: 36.618207,
    y_longitude: 109.434038,

    // 阳光健身 ---  健身馆
    j_latitude: 36.619369,
    j_longitude: 109.43379,

    // 健身馆 坐标 
    fitness_lat:0,
    fitness_long: 0,

    // 游泳馆 坐标
    swim_lat: 0,
    swim_long: 0,

    placeName:'', // 打卡地点

    current_lat: 0,
    current_long: 0,
    f_distance: 0,
    s_distance: 0,
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
      fitness_lat: this.data.j_latitude,
      fitness_long:this.data.j_longitude,
      swim_lat: this.data.y_latitude,
      swim_long: this.data.y_longitude
    })
    this.getLocationFun()
  },

  // 获取当前位置
  getLocationFun() {
    const wxs = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        console.log(res)
        const fitness_m = util.getDistance(
          res.latitude,
          res.longitude,
          wxs.data.fitness_lat,
          wxs.data.fitness_long
        )
        const swim_m = util.getDistance(
          res.latitude,
          res.longitude,
          wxs.data.swim_lat,
          wxs.data.swim_long
        )
        console.log(fitness_m)
        console.log(swim_m)
        var status = 0
        var scopeLimit = 150
        if(fitness_m <= scopeLimit || swim_m <= scopeLimit ){
          if(wxs.data.unsignId && !wxs.data.endTime){
            status = 3
          } else {
            status = 2
          } 
        } else {
          status = 1
        }
        wxs.setData({
          placeName: fitness_m <= scopeLimit ? '康乐中心':swim_m <= scopeLimit?'阳光健身':'',
          buttonStatus: status,
          // current_lat: res.latitude,
          // current_long: res.longitude,
          // f_distance: fitness_m,
          // s_distance: swim_m,
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
      pageIndex: ++pageIndex,
      loading:true
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
        wxs.setData({
          noMore: resData.data.list.length === 0 ? true: false
        })
        resData.data.list.map(item=>{
          item.AttachmentUrl = httpUrl.host + item.AttachmentUrl
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

  onChange(e){
    var wxs = this
    common.showLoading()
    wxs.setData({
      activeName: e.detail.title,
      activeIndex: e.detail.index,
      loadMore:false,
      pageIndex:1,
      pageSize:10,
    })
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

  btnClick() {
    if(this.data.isShow ){ return }
    if(this.data.buttonStatus === 1){
      this.getLocationFun()
    } else if(this.data.buttonStatus === 2){
      this.clockIn()
    } else if(UserData.get().unsignId && this.data.buttonStatus === 3){
      this.endClockIn()
    } else if(this.data.buttonStatus !== 1){
      common.showToast('运动记录异常，请联系管理员')
    } 
    
  },
  // 打卡操作
  clockIn() {
    const wxs = this
    wxs.loaddingFun(true)
    let data = {
      employeeId: UserData.get().id,
      placeName: wxs.data.placeName
    }
    requestLib.request({
      url:  httpUrl.signIn,
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
          userData.unsignId = resData.data.id
          UserData.set(userData)
          wxs.setData({
            buttonStatus: 3
          })
          common.showToast('运动打卡成功', 3000)
        } else {
          common.showToast('运动打卡失败', 3000)
        }
      } else {
        common.showToast(error.errMessage, 3000)
      }
      wxs.loaddingFun()
    }
  },

  // 结束打卡
  endClockIn() {
    const wxs = this
    wxs.loaddingFun(true)
    let data = {
      id: UserData.get().unsignId
    }
    requestLib.request({
      url:  httpUrl.signBack,
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
          userData.endTime = resData.data
          UserData.set(userData)
          wx.navigateTo({
            url:'../../fitness/pages/mySport/index'
          })  
        } else {
          common.showToast('结束打卡失败', 3000)
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
  },

  mySport() {
    wx.navigateTo({
      url:'../../fitness/pages/mySport/index'
    }) 
  }
  
})