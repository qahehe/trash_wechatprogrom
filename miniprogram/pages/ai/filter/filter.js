const db = wx.cloud.database()
Page({


  data: {
    MAX_LIMIT: 20,
    page: 0,
    dataCount: 0,
    datas: [],
    type: 1,
    logo:"",
    city:'',

    //图片位置：
    household:"/images/HouseholdfoodWaste.jpg",
    residual:"/images/ResidualWaste.png",
    recyclable:"/images/RecycleableWaste.jpg",
    hazardous:"/images/HazardouAwaste.jpg",
    kitchen1:"/images/KitchenWasteIcon1.png",
    kitchen2:"/images/KitchenWasteIcon2.png",
    perishable:"/images/PerishableWasteIcon.png",
    other:"/images/OtherWasteIcon.png",
    other2:"/images/OtherWasteIcon2.png"
  },


  onLoad: function(options) {
    console.log(JSON.stringify(options))
    this.data.type = options.type
    this.data.city=options.city
    //console.log(this.data.city)
    var typeInt = parseInt(this.data.type)
    var title = ""
    var citys=this.data.city
    var logoImg=""
    switch (typeInt) {
      case 3:
        title = '可回收物'
        logoImg ="/images/RecycleableWaste.jpg"
        this.data.type="1"
        break;
      case 4:
        title = '有害垃圾'
        logoImg = "/images/HazardouAwaste.jpg"
        break;
      case 1:
        if(citys =="xian"|| citys=="ningbo" || citys=="uramqi" ||citys=="nanchang"||citys=="shigatse"||
        citys=="hohhot" || citys=="harbin" || citys=="xiamen" || citys=="yichun" ||citys=="hefei"||
        citys=="shenzhen"|| citys=="zhengzhou"|| citys=="yichang" || citys=="xianyang" || citys=="fuzhou"||
        citys=="deyang" ||citys=="xining" || citys=="yichuan" || citys=="beijing"){
          title = '厨余垃圾'
          logoImg =this.data.kitchen1
        }
        else if(citys=="shanghai" || citys=="handan"){
          title = '湿垃圾'
          logoImg =this.data.household
        }
        else if(citys=="chengdu" || citys=="shenyang" || citys=="nanjing" || citys=="jinan" ||citys=="taian"
        || citys=="guangyuan" || citys=="lhasa" || citys=="qingdao" || citys=="wuhu" || citys=="guangzhou"){
          title = '餐厨垃圾'
          logoImg =this.data.kitchen2
        }
        else{
          title = '易腐垃圾'
          logoImg =this.data.perishable
        }
        this.data.type="3"
        break;
      case 2:
        if(citys =="xian" || citys =="guangzhou"){
          title = '其他垃圾'
          logoImg =this.data.other2
        }
        else if(citys=="shanghai" || citys=="handan"){
          title = '干垃圾'
          logoImg =this.data.residual
        }
        else{
          title = '其他垃圾'
          logoImg =this.data.other
        }
        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      logo:logoImg
    })
    this.data.dataCount = db.collection('product').where({
      sortId: this.data.type
    }).count()
    this.onGetData()
  },
  onGetData: function() {
    wx.showLoading({
      title: '正在加载数据中.....',
    })
    if (this.data.dataCount < this.data.page * this.data.MAX_LIMIT) {
      wx.showToast({
        title: '数据已经加载完',
        icon: "none"
      })
      wx.hideLoading()
      return
    }
    var that = this
    if (this.data.page == 0) {
      this.data.datas = []
    }
    var datas = db.collection('product').skip(this.data.page * this.data.MAX_LIMIT).limit(this.data.MAX_LIMIT).where({
      sortId: parseInt(that.data.type)
    }).get({
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        that.data.page = that.data.page + 1
        for (var i = 0; i < res.data.length; i++) {
          that.data.datas.push(res.data[i])
        }
        that.setData({
          datas: that.data.datas
        })
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
          icon: "none"
        })
      }
    })
  },
  onPullDownRefresh: function() {
    this.data.page = 0
    this.onGetData()
  },

  onReachBottom: function() {
    this.onGetData()
  },

})