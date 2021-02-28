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
        title: '上传视频', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      showPop: false,
      typeLoading:false,
      selectTypeName: '',
      typeList:[],
      paramData:{
        Id: '',
        fileType:'',
        EmployeeId: '',
        Title: '',
        Description: '',
        AttachementUrl: '',
        TypeCode: '',
        fileUrl:''
      },
      isShow: false
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        'paramData.EmployeeId':UserData.get().id
      })
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
  },
  selectClick(){
    this.setData({
      showPop:true,
      typeLoading:true
    })
    this.getTypeFun()
  },
  selectType(e){
    if(this.data.paramData.fileType){
      return
    }
    let type = e.currentTarget.dataset.type
    if(type === 'video'){
      this.selectVideo(type)
    } else {
      this.choosefilefun(type)
    }
  },
  //选择要上传的上传文件
  choosefilefun(){
    let _that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let fileType = (res.tempFiles[0].name.split('.'))[1]
        if (fileType != 'doc' && fileType != 'docx' && fileType != 'ppt' && fileType != 'pptx'){
          common.showToast('请上传word文档或者ppt文件', 3000)
          return
        }
        _that.setData({
          'paramData.fileType': fileType,
          'paramData.fileUrl':res.tempFiles[0].path
        })

        _that.upload(res.tempFiles[0])
      }
    })
  },

  //上传图片的接口
  upload: function (file) {
    let wxs = this
    common.showLoading()
    wx.uploadFile({
      url: httpUrl.uploadfile, //根据具体后端程序IP修改
      filePath: file.path,
      name: 'file',
      formData: {
        'fileName': file.name,
      },
      success: function (res) {
        common.hideLoading()
        console.log(res)
        let data = JSON.parse(res.data)
        if(data.code === 0) {
          wxs.setData({
            'paramData.AttachementUrl':data.data
          })
          common.showToast('文件上传成功', 3000)
        } else {
          wxs.setData({
            'paramData.fileType': '',
            'paramData.AttachementUrl':'',
            'paramData.fileUrl':''
          })
          common.showToast('文件上传失败', 3000)
        }
      },
      fail: function(){
        common.hideLoading()
        wxs.setData({
          'paramData.fileType': '',
          'paramData.AttachementUrl':'',
          'paramData.fileUrl':''
        })
      },
    })
    
  },

  //
  getTypeFun() {
    const wxs = this
    requestLib.request({
      url:  httpUrl.getSelectMajor,
      method: 'post',
      data: {enCode:'StaffHall'},
      success: successFun,
      fail: (error)=>{
        wxs.setData({
          typeLoading:false
        })
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      wxs.setData({
        typeLoading:false
      })
      const resData = res.data
      if(resData && resData.code === 0){
        wxs.setData({
          typeList:resData.data,
        })
      } else {
        common.showToast(error.errMessage, 3000)
      }
    }
  },
 
  onConfirm(e){
    this.setData({
      showPop:false,
      'paramData.TypeCode': e.detail.value.id,
      selectTypeName:e.detail.value.text,
    })
  },
  onCancel(){
    this.setData({
      showPop:false
    })
  },
  pushBtn() {
    const wxs = this
    if(!wxs.verify()){ return }
    wxs.submit()
  },
  inputTitle(e){
    this.setData({
      'paramData.Title':e.detail
    })
  },
  // 表单验证
  verify(){
    let wxs = this 
    if(!wxs.data.paramData.AttachementUrl){
      common.showToast('请上传视频')
      return false
    } else if(!wxs.data.paramData.Title){
      common.showToast('请输入标题')
      return false
    } else {
      return true
    }
  },
  submit() {
    const wxs = this
    wxs.submitFun()
  },
  submitFun(){
    const wxs = this
    wxs.setData({
      isShow: true
    })
    requestLib.request({
      url:  httpUrl.saveHallStyle,
      method: 'post',
      data: wxs.data.paramData,
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        wxs.setData({
          isShow: false
        })
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      wxs.setData({
        isShow: false
      })
      if(resData && resData.code === 0){
        common.showToast('提交成功，请等待审核！', 3000)
        wx.navigateBack() 
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },
  selectVideo(type){
    const _that = this
    wx.chooseVideo({
      size: 1,
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        _that.setData({
          'paramData.fileType': type,
          'paramData.fileUrl':res.tempFilePath
        })
        let fileType  = res.tempFilePath.substring(res.tempFilePath.lastIndexOf(".") + 1 , res.tempFilePath.length);
        _that.upload({path: res.tempFilePath, name: (new Date()).getTime()+'.'+ fileType })
      }
    })
  },
  deleteBtn(e){
    this.setData({
      'paramData.fileType': '',
      'paramData.AttachementUrl':'',
      'paramData.fileUrl':''
    })
  },
})

