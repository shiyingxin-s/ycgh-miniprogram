var UserData = require('../../api/userData')
const requestLib = require('../../api/request')
const httpUrl = require('../../config')
const common = require('../../util/common.js')
const app = getApp()


Component({
  properties: {
     answerObj: Object,
     type: String
  },
  data:{
    check:false,
    height: app.globalData.whHeight - 260,
    right: 0,
    wrong: 0
  },
  methods: {
    onChange(e) {
      let eventData = e.detail
      var itemList = this.data.answerObj
      eventData.map(item=>{
        var strArray = item.split(',')
          itemList = this.data.answerObj.map(n1=>{
            if(strArray[3] === 'false' || this.data.type === 'exam'){
              if(n1.Id === strArray[0]){
                n1.Options.map(n2=>{
                  if(n2.Id === strArray[1]){
                    n2.myCheck = !n2.myCheck
                    n1.isDo = true
                  } else if(strArray[2] === '单选题' || strArray[2] === '判断题'){
                    n2.myCheck = false
                    n1.isDo = true
                  }
                })
              }
            }
            return n1
          })
      })
      this.setData({
        answerObj: itemList
      })
      this.count()
    },

    // 统计对错 
    count() {
      const wxs = this
      wxs.setData({
        wrong: 0,
        right: 0
      })
      let doList = wxs.data.answerObj.filter(item=>!!item.isDo)
      doList.map(item=>{
        item.ok = item.Options.filter(n=>!!n.IsCorrectAnswer)
        if(item.ok.filter(n2=>!n2.myCheck).length>0){
          wxs.setData({
            wrong: wxs.data.wrong+1
          })
        } else {
          wxs.setData({
            right: wxs.data.right+1
          })
        }
      })
    },

    submit(){
      let noDoList = this.data.answerObj.filter(n=>{
          return !n.isDo
      })
      if(noDoList.length>0){
        common.showToast('你还有未答试题，不能交卷', 3000)
        return
      }
      this.triggerEvent("submit", { 
        list: this.data.answerObj,
        type: this.data.type, 
        paperId: 0
      })
    },
    // 删除错题
    delete(e){
      const wxs = this
      let data = {
        employeeId: UserData.get().id,
        questionId : e.currentTarget.dataset.id
      }
      requestLib.request({
        url:  httpUrl.deleteWrong,
        method: 'post',
        data: data,
        success: successFun,
        fail: (error)=>{
          common.showToast(error.errMessage, 3000)
        }
      })
      function successFun(res){
        const resData = res.data
        if(resData && resData.code === 0){
          if(resData.data){
            wxs.setData({
              answerObj: wxs.data.answerObj.splice(e.currentTarget.dataset.id,1)
             })
             common.showToast('删除成功', 3000)
          }else {
            common.showToast('删除失败，请重试', 3000)
          }        
        } else {
          common.showToast(error.errMessage, 3000)
        }
      }
    },

    // 多选确认答案
    okClick(e) {
      const wxs = this
      debugger
    }
  }

}) 