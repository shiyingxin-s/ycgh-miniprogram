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
        title: '爱心救助', //导航栏 中间的标题,
        isBackPer: true, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
      id:'',
      active: 0,
      paramData:{
        employeeName:'',
        departName:'',
        employeeType:'',
        Phone:'',
        EmployeeCode:'',
        EmployeeId: '',
        IdCard: '', //身份证号
        Title:'',
        Statement: '',//情况描述
        Attachments:'', //图片
        imageList:[],
        IdCardImgA :'',//身份证正面照
        IdCardImgB:'',//身份证反面照
        FullFaceImg:'',//人身正面照 
        showImgList:[],
        IdCardImgAShow :'',//身份证正面照
        IdCardImgBShow:'',//身份证反面照
        FullFaceImgShow:''//人身正面照 
      },
      isShow: false
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id:options.id,
        // 'nvabarData.title':'详情'
      })
      common.showLoading()
      this.getDataFun()
    }
  },
  onShow: function () {
    if(!UserData || !UserData.get().token ){
      wx.redirectTo({
        url: '../../../../page/login/index'
      })
    }
    if(!this.data.id){
      this.initData(UserData.get())
    }
  },
  initData(data){
    const wxs = this
    wxs.setData({
      'paramData.employeeName':wxs.data.id? data.Name:data.name,
      'paramData.EmployeeId': wxs.data.id? data.EmployeeId: data.id,
      'paramData.EmployeeCode':wxs.data.id? data.EmployeeCode:data.employeeCode,
      'paramData.departName': wxs.data.id?data.DepartName:data.departName,
      'paramData.employeeType': wxs.data.id?data.EmployeeType:data.employeeType
    })
    console.log(wxs.data.paramData)
  },
  // 获取数据
  getDataFun() {
    const wxs = this
    let data = {
      EmployeeId:UserData.get().id,
      Id: wxs.data.id,
    }
    requestLib.request({
      url:  httpUrl.getAidDetial,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      const resData = res.data
      if(resData && resData.code === 0){
        resData.data.imageList = resData.data.Attachments.split('||')
        resData.data.showImgList = resData.data.imageList.map(item=>{
          item = httpUrl.host + item
          return item
        })
        resData.data.FullFaceImgShow = httpUrl.host + resData.data.FullFaceImg
        resData.data.IdCardImgAShow = httpUrl.host + resData.data.IdCardImgA
        resData.data.IdCardImgBShow = httpUrl.host + resData.data.IdCardImgB
        wxs.setData({
          paramData:resData.data
        })
        wxs.initData(resData.data)
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },
  next() {
    const wxs = this
    if(!wxs.verify()){ return }
    if(wxs.data.active === 2){
      wxs.submit()
      return
    }
    wxs.setData({
      active:wxs.data.active+1
    })
  },
  prev(){
    const wxs = this
    wxs.setData({
      active:wxs.data.active - 1
    })
  },
  inputIdCard(e){
    this.setData({
      'paramData.IdCard':e.detail
    })
  },
  inputPhone(e){
    this.setData({
      'paramData.Phone':e.detail
    })
  },
  inputTitle(e){
    this.setData({
      'paramData.Title':e.detail
    })
  },
  inputDesc(e){
    this.setData({
      'paramData.Statement':e.detail
    })
  },
  // 表单验证
  verify(){
    let wxs = this
    if(wxs.data.active === 0){
      if(!common.validateIdCard(wxs.data.paramData.IdCard)){
        common.showToast('请输入合法的身份证号')
        return false
      } else if(!common.validatePhone(wxs.data.paramData.Phone)){
        common.showToast('请输入合法的手机号')
        return false
      } else {
        return true
      } 
    } else if(wxs.data.active === 1){
      if(!wxs.data.paramData.Title){
        common.showToast('请输入标题')
        return false
      } else if(!wxs.data.paramData.Statement){
        common.showToast('请填写描述原因')
        return false
      } else {
        return true
      }
    } else if(wxs.data.active === 2){
      if(wxs.data.paramData.imageList.length === 0){
        common.showToast('请上传申请书照片',3000)
        return false
      } else if(!wxs.data.paramData.FullFaceImg){
        common.showToast('请上传申请人本身照片',3000)
        return false
      } else if(!wxs.data.paramData.IdCardImgA){
        common.showToast('请上传申请人身份证正面照片',3000)
        return false
      } else if(!wxs.data.paramData.IdCardImgB){
        common.showToast('请上传申请人身份证反面照片',3000)
        return false
      } else {
        return true
      }
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
      'paramData.Attachments': imgStr
    })
    if(wxs.data.id) {
      wxs.updateClickFun()
    } else {
      wxs.submitFun()
    }
  },
  submitFun(){
    const wxs = this
    wxs.setData({
      isShow: true
    })
    requestLib.request({
      url:  httpUrl.submitAid,
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
  selectImg(e) {
    const wxs = this
    let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 4,
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
  deleteBtn(e){
    let index = e.currentTarget.dataset.index
    let list = this.data.paramData.imageList
    let showList = this.data.paramData.showImgList
    if(index === 'FullFaceImg'){
      this.setData({
        'paramData.FullFaceImg': ''
      })
    } else if(index === 'IdCardImgA'){
      this.setData({
        'paramData.IdCardImgA': ''
      })
    } else if(index === 'IdCardImgB'){
      this.setData({
        'paramData.IdCardImgB': ''
      })
    } else {
      list.splice(index,1)
      showList.splice(index,1)
      this.setData({
        'paramData.imageList': list,
        'paramData.showImgList': showList
      })
    }
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
          if(type === 'FullFaceImg'){
            wxs.setData({
              'paramData.FullFaceImg': data.data,
              'paramData.FullFaceImgShow': httpUrl.host + data.data,
            })
          } else if(type === 'IdCardImgA'){
            wxs.setData({
              'paramData.IdCardImgA': data.data,
              'paramData.IdCardImgAShow': httpUrl.host + data.data,
            })
          } else if(type === 'IdCardImgB'){
            wxs.setData({
              'paramData.IdCardImgB': data.data,
              'paramData.IdCardImgBShow': httpUrl.host + data.data,
            })
          } else {
            let list = wxs.data.paramData.imageList
            let showList =  wxs.data.paramData.showImgList
            list.push(data.data)
            showList.push(httpUrl.host + data.data)
            wxs.setData({
              'paramData.imageList':list,
              'paramData.showImgList':showList
            })
          }
          common.showToast('上传成功', 3000)
        } else {
          common.showToast('文件上传失败', 3000)
        }
      },
      fail: function(){
        common.hideLoading()
      },
    })
    
  },
  updateClick(){
    const wxs = this
    if(!wxs.verify()){ return }
    wxs.submit()   
  },
  updateClickFun(){
    const wxs = this
    wxs.setData({
      isShow: true
    })
    let data = {... wxs.data.paramData}
    data['Id'] = wxs.data.id
    requestLib.request({
      url:  httpUrl.submitAid,
      method: 'post',
      data: data,
      success: successFun,
      fail: (error)=>{
        wxs.setData({
          isShow: false
        })
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      wxs.setData({
        isShow: false
      })
      const resData = res.data
      if(resData && resData.code === 0){
        common.showToast('修改成功', 3000)
        wx.navigateBack() 
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  },
  cancel(){
    const wxs = this
    wxs.setData({
      isShow: true
    })
    requestLib.request({
      url:  httpUrl.revokeAid,
      method: 'post',
      data: {Id:wxs.data.id},
      success: successFun,
      fail: (error)=>{
        wxs.setData({
          isShow: false
        })
        common.hideLoading()
        common.showToast(error.errMessage, 3000)
      }
    })
    function successFun(res){
      wxs.setData({
        isShow: false
      })
      const resData = res.data
      if(resData && resData.code === 0){
        common.showToast('撤销成功', 3000)
        wx.navigateBack() 
      } else {
        common.showToast(error.errMessage, 3000)
      }
      common.hideLoading()
    }
  }
})

