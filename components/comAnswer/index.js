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
    isHide:true,
    check:false,
    opcityHeight: app.globalData.whHeight - (app.globalData.navHeight * 2 + 19),
    height: app.globalData.whHeight - 260,
    right: 0,
    wrong: 0,
    isShowBtn: false
  },
  attached: function () {
    if(this.data.type === 'review'){
      this.count()
    }
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
                    if(strArray[2] === '多选题' && this.data.type === 'exam'){
                      n1.isDo = true
                    } else if(strArray[2] === '多选题'){
                      n1.isDo = false
                    } else {
                      n1.isDo = true
                    }
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
      var str = eventData[0].split(',')
      if(this.data.type !== 'review' &&  str[2] !== '多选题')(
        this.count()
      )
      let noDoList = this.data.answerObj.filter(n=>{
        return (!n.isDo && n.QuestionType!=='多选题' ) || n.Options.length === 0
      })
      let isShowBtn = false
      if(noDoList.length === 0){
        isShowBtn = true
      }
      this.setData({
        isShowBtn: isShowBtn
      })
    },
    myOk(){
      this.setData({
        isHide: false
      })
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
        item.ok = ''
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
          return (!n.isDo && n.QuestionType!=='多选题' ) || n.Options.length === 0
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
            let list = wxs.data.answerObj
            let index = list.findIndex(item=>item.Id === e.currentTarget.dataset.id)
            list.splice(index,1)
            wxs.setData({
              answerObj: list
            })
            wxs.count()
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
      let list = wxs.data.answerObj
      let index = list.findIndex(item=>e.currentTarget.dataset.id === item.Id)
      list[index].isDo = true
      wxs.setData({
        answerObj: list
      })
      wxs.count()
    }
  }

}) 