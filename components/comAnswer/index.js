import Dialog from '../../dist/dialog/dialog'
const app = getApp()


Component({
  properties: {
     answerObj: Object,
     type: String
  },
  data:{
    check:false,
    height: app.globalData.whHeight - 300
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
    },
    onChange(e) {
      let eventData = e.detail
      var itemList = this.data.answerObj
      eventData.map(item=>{
        var strArray = item.split(',')
        itemList = this.data.answerObj.map(n1=>{
          if(n1.Id === strArray[0]){
            n1.Options.map(n2=>{
              if(n2.Id === strArray[1]){
                n2.myCheck = !n2.myCheck
              } else if(strArray[2] === '单选题' || strArray[2] === '判断题'){
                n2.myCheck = false
              }
            })
          }
          return n1
        })
      })
      this.setData({
        answerObj: itemList
      })
    },
    submit(){
      Dialog.confirm({
        title: '确认',
        message: '确认交卷，本次成绩将会计入系统'
      }).then(() => {
        this.triggerEvent("submit", { 
          list: this.data.answerObj,
          type: this.data.type, 
          paperId: 0
        })
      }).catch(() => {
        
      });
    }
  }

}) 