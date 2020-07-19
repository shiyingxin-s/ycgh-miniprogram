const app = getApp()

Component({
  properties: {
    resultData: Object,
  },
  data: {
    height: app.globalData.whHeight - 120
  },
  methods: {
    submit(){
      this.triggerEvent("ok")
    }
  }
})

