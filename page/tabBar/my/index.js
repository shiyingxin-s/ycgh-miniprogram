const app = getApp()

Page({
  data: {
     // 此页面 页面内容距最顶部的距离
     height: app.globalData.navHeight * 2 + 25 ,
       // 组件所需的参数
       nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: '个人中心', //导航栏 中间的标题,
        isBackPer: false, //不显示返回按钮,
        bgColor:'#f4424a' //导航背景色
      },
   
  },
    onShow: function () {
    }
   
})
