var t = require("../../utils/module"), 
s = t(require("../../mainInfo.js")), 
n = require("../../tipInfo.js"),
http = require('../../utils/http.js'); //http协议
getApp();

Page({

  data: {
    SHOW_TOP: true,
    images: {
      magnifier: "/images/tab_bar_icon_magnifier.png",
      qrB: "/images/qr_b.png",
      wsgQr: "/images/zsm.jpg",
      location: "/images/location.png",
      broadcast: "/images/broadcast.png"
    },
    tipInfo: n.tipInfo,
    city: "shanghai",

    //从相册导入的url
    tempFilePaths: '',
    accessToken:'',
    results:[],
    isShow:false
  },

  onLoad: function(options) {
    this.initData(), wx.showShareMenu({
      withShareTicket: !0
    });

    var myDate = new Date();
    var isShowed=wx.getStorageSync("tip")
    if(isShowed!=1){
      setTimeout(() => {
        this.setData({
          SHOW_TOP: false
        })
        wx.setStorageSync("tip", 1)
      }, 2 * 1000)
    }else{
      this.setData({
        SHOW_TOP: false
      })
    }

    //相册 图像api
    var time=wx.getStorageSync("time")
    var curTime = new Date().getTime()
    var timeNum=new Date(parseInt(curTime - time) * 1000).getDay() 
    console.log("======="+timeNum)
    var accessToken=wx.getStorageSync("access_token")
    console.log("====accessToken===" + accessToken+"a")
    if (timeNum > 28 || (accessToken == "" ||
      accessToken == null||accessToken == undefined)){
      this.accessTokenFunc()
    }else{
      this.setData({
        accessToken: wx.getStorageSync("access_token")
      })
    }
  },

  initData: function () {
    void 0 === wx.getStorageSync("city") || 0 === wx.getStorageSync("city").length ? (wx.setStorageSync("city", this.data.city)) : this.setData({
      city: wx.getStorageSync("city")
    });
    var e = [];
    for (var a in s.default.cities) e.push(s.default.cities[a]);
    this.setData({
      tipInfo: n.tipInfo,
      config: s.default,
      cities: e
    });
  },
  onShow: function () {
    (this.setData({
      tipInfo: n.tipInfo
    }))
    
    wx.getStorageSync("city") !== this.data.city && this.setData({
      city: wx.getStorageSync("city"),
    });
    this.setFakeSearchLeft()
  },
  startSearch: function (t) {
    wx.navigateTo({
      url: "../ai/search"
    });
  },
  chooseCity: function (t) {
    var e = t.currentTarget.dataset.itemKey;
    e !== this.data.city && (wx.setStorageSync("city", e), this.setData({
      city: e,
      showChooseCity: !1,
      enableScroll: !0
    }), this.setFakeSearchLeft());
  },
  closeOverlay: function () {
    this.setData({
      showChooseCity: !1,
      enableScroll: !0
    });
  },
  showChooseCity: function () {
    this.setData({
      showChooseCity: !0,
      enableScroll: !1
    });
  },
  switchToTest: function () {
    wx.switchTab({
      url: "/pages/test/test"
    });
  },
  setFakeSearchLeft: function () {
    var t = this;
    wx.createSelectorQuery().select("#currentCity").boundingClientRect(function (e) {
      t.setData({
        fakeSearchLeft: "left: calc(25rpx + 21rpx + " + e.width + "px);"
      });
    }).exec();
  },
  goSearch: function() {
    wx.navigateTo({
      url: 'search',
    })
  },

  //拍照识别
  onBindCamera:function(){
    var _this = this;  
    wx.chooseImage({  
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        wx.getFileSystemManager().readFile({
          filePath:res.tempFilePaths[0],
          encoding:"base64",
          success: res => {
            console.log(res.data)
            _this.req(_this.data.accessToken,res.data)
          },
          fail:res=>{
            wx.hideLoading()
            wx.showToast({
              title: '拍照失败,未获取相机权限或其他原因',
              icon:"none"
            })
          }
        })
      }  
    }) 
  },
  //从相册导入代码
  onBindAlbum:function(){
    var _this = this;  
    wx.chooseImage({  
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        wx.getFileSystemManager().readFile({
          filePath:res.tempFilePaths[0],
          encoding:"base64",
          success: res => {
            console.log(res.data)
            _this.req(_this.data.accessToken,res.data)
          },
          fail:res=>{
            wx.hideLoading()
            wx.showToast({
              title: '获取相册失败,未获取相册权限或其他原因',
              icon:"none"
            })
          }
        })
      }  
    }) 
  },
  req:function(token,image){
    var that=this
    http.req("https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token="+token,{
      "image": image
    },function(res){
      wx.hideLoading()
      console.log(JSON.stringify(res))
      var num=res.result_num
      var results = res.data.result
      if (results!=undefined&&results!=null){
        that.setData({
          isShow: true,
          results: results
        })
        
        console.log(results)
      }else{
        wx.showToast({
          icon: 'none',
          title: 'AI识别失败,请联系管理员',
        })
      }
    },"POST")
  },
  accessTokenFunc:function(){
    var  that=this
    console.log("accessTokenFunc is start")
    wx.cloud.callFunction({
      name: 'baiduAccessToken',
      success: res => {
        console.log("===="+JSON.stringify(res))
        console.log("====" + JSON.stringify(res.result.data.access_token))
        that.data.accessToken = res.result.data.access_token
        wx.setStorageSync("access_token", res.result.data.access_token)
        wx.setStorageSync("time", new Date().getTime())
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  radioChange:function(e){
    wx.navigateTo({
      url: '/pages/result/list?keyword=' + e.detail.value,
    })
  },
  hideModal:function(){
    this.setData({
      isShow:false,
    })
  },



  onShareAppMessage: function() {
    return {
      title: "智能垃圾分类",
      imageUrl: "../../images/no-result.png",
      path: "pages/ai/index"
    }
  }
})