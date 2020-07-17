

App({
  globalData: {
    navHeight: 0,
    tabBarHeight:0
  },

  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.navHeight = res.statusBarHeight
      }
    })

    let systemInfo = wx.getSystemInfoSync()
	  // px转换到rpx的比例
      let pxToRpxScale = 750 / systemInfo.windowWidth;
      // 状态栏的高度
      let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
      // 导航栏的高度
      let navigationHeight = 44 * pxToRpxScale
      // window的宽度
      let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
      // window的高度
      let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
      // 屏幕的高度
      let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
      // 底部tabBar的高度
      let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight

      this.globalData.tabBarHeight = tabBarHeight
  },
  // 生命周期回调——监听小程序启动或切前台。
  onShow: function() {
    this.autoUpdate()
  },

  /**
   * 自动更新小程序-------------------开始------------------------
   * 
   */
  autoUpdate: function() {
    var wxs = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function(res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                wxs.downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                  showCancel:false,//隐藏取消按钮
                  confirmText:"确定更新",//只保留确定更新按钮
                  success: function(res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      wxs.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager){
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },
  //  自动更新小程序-------------------结束------------------------ 


})
