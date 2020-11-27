const app = getApp()
const requestLib = require('../../../../api/request')
var UserData = require('../../../../api/userData')
const httpUrl = require('../../../../config')
const common = require('../../../../util/common.js')

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 19 ,
    conHeight: wx.getSystemInfoSync().windowHeight - (app.globalData.navHeight * 2 + 19),
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '职工风采', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#f4424a' //导航背景色
    },
    index: -1,
    datas:'',
    imageListData:[],
    id:'',
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // common.showLoading()
    // var pages = getCurrentPages();
    // var prevPage = pages[pages.length - 2]; // 上一个页面
    // let prevPageData = prevPage.data.dataList[options.index]
    // let imgLData=[]
    // if(prevPageData.imageList.length>0){
    //   prevPageData.imageList.map(item=>{
    //     wx.getImageInfo({
    //       src: item,
    //       success:res=>{
    //         let imgData = {
    //             width:res.width,
    //             height: wx.getSystemInfoSync().windowWidth/res.width*res.height,
    //             src: item
    //         }
    //         imgLData.push(imgData)
    //         this.setData({
    //           imageListData: imgLData,
    //         })
    //       }
    //     })
        
    //   })
    // }
    
    this.setData({
      id:options.id
    })
    
    this.getDetail()
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
  },
  // 获取详情
  getDetail() {
    let data = {
      employeeId: UserData.get().id,
      id: this.data.id
    }
    common.showLoading()
    requestLib.request({
      url:  httpUrl.staffstyleDetail,
      method: 'post',
      data: data,
      success: (res)=>{
        const resData = res.data
        if(resData && resData.code === 0){
          let list = resData.data.Pictures? resData.data.Pictures.split('||'):[]
          resData.data.fileType = resData.data.AttachementUrl? (resData.data.AttachementUrl.split('.'))[1] : ''
          resData.data.AttachementUrl = httpUrl.host +  resData.data.AttachementUrl
          resData.data.imageList= list.map(n=>{
            n = httpUrl.host + n
            return n
          })
          this.setData({
            datas:resData.data
          })
          let imgLData=[]
          if(resData.data.imageList.length>0){
            resData.data.imageList.map(item=>{
              wx.getImageInfo({
                src: item,
                success:res=>{
                  let imgData = {
                      width:res.width,
                      height: wx.getSystemInfoSync().windowWidth/res.width*res.height,
                      src: item
                  }
                  imgLData.push(imgData)
                  this.setData({
                    imageListData: imgLData,
                  })
                }
              })
              
            })
          }
        } else {
          common.showToast(error.errMessage, 3000)
        }
        common.hideLoading()
      },
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
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
      success: (res)=>{
        common.hideLoading()
        const resData = res.data
        if(resData && resData.code === 0){
          let count = this.data.datas.LikeNums
          this.setData({
            'datas.IsLike':type === 'like'? true :false,
            'datas.LikeNums':type === 'like'? count+1 :count-1
          })
        } else {
          common.showToast(error.errMessage, 3000)
        }
      },
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
  },
 
  
})

