const util = require('./util.js');

let common = {
  //获取token  
  encryptionToken:function (str) {
    util.sortBase64(str);
    var base = new util.sortBase64();
    var encryptionToken = base.encode(str);
    return encryptionToken
  },
  // 本地存储
  setStorageSync:function (key, value){
    wx.setStorageSync(key, value)
  },

  // 删除本地存储
  removeStorageSync:function (key){
    wx.removeStorageSync(key)
  },
  // 获取本地存储
  getStorageSync:function (key){
    return wx.getStorageSync(key)
  },
  // Toast
  showToast:function (title, time, icon) {
    if (!icon) {
      icon ='none'
    }
    if(!time) {
      time = 2000
    }
    wx.showToast({
      title: title,
      icon: icon,
      duration: time
    })
  },
  showLoading:function(title, time, mask){
    wx.showLoading({
      title: title? title:'',
      mask: true
    })
    if(time){
      setTimeout(function () {
        wx.hideLoading()
      }, time)
    }
  },
  hideLoading:function(){
    wx.hideLoading()
  },
  scrollToTop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  //保留两位小数
  returnFloat:function (value){
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
          }
          return value;
    }
  },
  /* 匹配手机号码 1开头，11位*/
  validatePhone(str) {
    const reg = /^1\d{10}$/
    return reg.test(str)
  },
  // 匹配身份证
  validateIdCard(str) {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(str)
  },
  /**
   * validate email
   * @param email
   * @returns {boolean}
   */
  validEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  /**
   *  待支付订单 倒计时
   */
  countDown(dates) {
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimes = dates;
    // 对结束时间进行处理渲染到页面
    if (endTimes.orderCustomerStatus == 1) { //判断是不是待付款
      // 兼容 苹果手机
      var orderTime = endTimes.orderTime.replace(/\-/g, '/')
      let endTime = Date.parse(orderTime);
      let obj = null;
      // 如果活动未结束，对时间进行处理
      let time = parseInt(86400 - (newTime - endTime) / 1000);
      if (time > 0) {
        // 获取 时、分、秒
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          hou: '00',
          min: '00',
          sec: '00'
        }
        endTimes.orderCustomerStatus = 5; //倒计时为0  状态变为已取消
      }
      endTimes.countdownTime_List = obj;
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      detail_newsList: this.data.detail_newsList
    })
    setTimeout(this.countDown, 1000);
  },
}
module.exports = common;