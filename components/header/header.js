const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
  },
  attached: function () {
    // share获取是否是通过分享进入的小程序
    this.setData({
      height: app.globalData.navHeight, // 定义导航栏的高度   方便对齐
    })
  },
  methods: {
  // 返回上一页面
    _navback() {
        wx.navigateBack()   
    },
  //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/learnings/learning',
      })
    }
  }

}) 