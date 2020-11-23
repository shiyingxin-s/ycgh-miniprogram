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
        title: '职工风采', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      showPop: false,
      typeLoading:false,
      selectTypeName: '',
      typeList:[],
      fileType:'video',
      paramData:{
        Id: '',
        EmployeeId: '',
        fileType:'',
        Title: '',
        Description: '',
        AttachementUrl: '',
        TypeCode: '',
        Pictures: '',
        imageList:[],
        showImgList:[]
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
  //
  getTypeFun() {
    const wxs = this
    requestLib.request({
      url:  httpUrl.getSelectMajor,
      method: 'post',
      data: {enCode:'StaffStyle',isEdit: true},
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
  inputDesc(e){
    this.setData({
      'paramData.Description':e.detail
    })
  },
  // 表单验证
  verify(){
    let wxs = this
      if(!wxs.data.paramData.TypeCode){
        common.showToast('请选择类别',3000)
        return false
      } else if(wxs.data.paramData.imageList.length === 0 && !wxs.data.paramData.AttachementUrl){
        common.showToast('请上传图片或视频')
        return false
      } else if(!wxs.data.paramData.Title){
        common.showToast('请输入标题')
        return false
      } else if(!wxs.data.paramData.Description){
        common.showToast('请填写内容')
        return false
      } else {
        return true
      }
  },
  submit() {
    const wxs = this
    let imgStr = ''
    wxs.data.paramData.imageList.map(item=>{
      if(imgStr){
        imgStr = imgStr + '||'
      }
      imgStr = imgStr + item
    })
    wxs.setData({
      'paramData.Pictures': imgStr
    })
    wxs.submitFun()
  },
  submitFun(){
    const wxs = this
    wxs.setData({
      isShow: true
    })
    requestLib.request({
      url:  httpUrl.saveStaffStyle,
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
  // 选择照片
  selectImg(data) {
    const wxs = this
    if(data != 'addIcon'){
      if(wxs.data.paramData.fileType){
        return
      }
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: photo => {
        // let base64 ='data:image/png;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0],'base64')
        // let list = wxs.data.paramData.imageList
        // list.push(res.tempFilePaths[0])

        //-----返回选定照片的本地文件路径列表，获取照片信息-----------
        wx.getImageInfo({
          src: photo.tempFilePaths[0],  
          success: function(res){
            //---------利用canvas压缩图片--------------
            var ratio = 2;
            var canvasWidth = res.width //图片原始长宽
            var canvasHeight = res.height
            while (canvasWidth > 400 || canvasHeight > 400){// 保证宽高在400以内
                canvasWidth = Math.trunc(res.width / ratio)
                canvasHeight = Math.trunc(res.height / ratio)
                ratio++;
            }
            that.setData({
                cWidth: canvasWidth,
                cHeight: canvasHeight
            })
        
            //----------绘制图形并取出图片路径--------------
            var ctx = wx.createCanvasContext('canvas')
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, setTimeout(function(){
                  wx.canvasToTempFilePath({
                      canvasId: 'canvas',
                      destWidth: canvasWidth,
                      destHeight: canvasHeight,
                      success: function (res) {
                          console.log(res.tempFilePath)//最终图片路径
                          let fileType  = res.tempFilePaths[0].substring(res.tempFilePaths[0].lastIndexOf(".") + 1 , res.tempFilePaths[0].length);
                          wxs.upload({path: res.tempFilePaths[0], name: (new Date()).getTime()+'.'+ fileType },'img')
                      },
                      fail: function (res) {
                          console.log(res.errMsg)
                    }
                })
            },100))  //留一定的时间绘制canvas
          }
        })
      }
    })
  },
  addIconClick(){
    this.selectImg('addIcon')
  },
  selectVideo(){
    const _that = this
    if(_that.data.paramData.fileType){
      return
    }
    wx.chooseVideo({
      size: 1,
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        _that.setData({
          'paramData.fileType': 'video',
          'paramData.fileUrl':res.tempFilePath
        })
        let fileType  = res.tempFilePath.substring(res.tempFilePath.lastIndexOf(".") + 1 , res.tempFilePath.length);
        _that.upload({path: res.tempFilePath, name: (new Date()).getTime()+'.'+ fileType },'video')
      }
    })
  },
  //上传图片的接口
  upload: function (file,type) {
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
        let data = JSON.parse(res.data)
        if(data.code === 0) {
          if(type === 'img'){
            let list = wxs.data.paramData.imageList
            let showList = wxs.data.paramData.showImgList
            list.push(data.data)
            showList.push(httpUrl.host + data.data)
            wxs.setData({
              'paramData.fileType': 'img',
              'paramData.imageList':list,
              'paramData.showImgList':showList
            })
          } else {
            wxs.setData({
              'paramData.AttachementUrl':data.data
            })
          }
          common.showToast('上传成功', 3000)
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
  deleteBtn(e){
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let list = this.data.paramData.imageList
    let showList = this.data.paramData.showImgList
    if(type === 'img'){
      list.splice(index,1)
      showList.splice(index,1)
    } 
    this.setData({
      'paramData.imageList':type === 'img'? list: '',
      'paramData.showImgList':type === 'img'? showList: '',
      'paramData.fileType':list.length === 0 ? '' :'img',
      'paramData.AttachementUrl':'',
      'paramData.fileUrl':''
    })
  },
  updateClick(){
    const wxs = this
    if(!wxs.verify()){ return }
    wxs.submit()   
  },
  
})

