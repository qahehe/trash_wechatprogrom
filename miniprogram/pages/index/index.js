const db = wx.cloud.database() //导入云数据库
var t = require("../../utils/module"),
s = t(require("../../mainInfo.js")), 
n = require("../../tipInfo.js");

getApp();

Page({
    data: {
      secId: 0,
      images: {
          magnifier: "/images/tab_bar_icon_magnifier.png",
          qrB: "/images/qr_b.png",
          wsgQr: "/images/zsm.jpg",
          location: "/images/location.png",
          broadcast: "/images/broadcast.png"
      },
      ColorList: [
        "../../images/RecycleableWaste.jpg",
        "../../images/HazardouAwaste.jpg",
        "../../images/HouseholdfoodWaste.jpg",
        "../../images/ResidualWaste.png",
      ],
      tipInfo: n.tipInfo,
      city: "guangzhou",
      MAX_LIMIT: 20,
      page: 0,
      dataCount: 0,
      datas: [],
      type: 3,
      enableScroll: !0,
      scrollTop: 0
    },
    onLoad: function() {
      this.initData(), wx.showShareMenu({
          withShareTicket: !0
      });
    },
    initData: function() {
        void 0 === wx.getStorageSync("city") || 0 === wx.getStorageSync("city").length ? (wx.setStorageSync("city", this.data.city)) : this.setData({
            city: wx.getStorageSync("city")
        });
        var e = [];
        for (var a in s.default.cities) e.push(s.default.cities[a]);
        this.setData({
            tipInfo: n.tipInfo,
            config: s.default,
            cities: e
        }), 
        this.updateData();
    },
    onShow: function() {
        ((this.setData({
          tipInfo: n.tipInfo
        })),
        (this.updateData())
        )
        wx.getStorageSync("city") !== this.data.city && this.setData({
            city: wx.getStorageSync("city"),
        });
    },
    onShareAppMessage: function(t) {
        return {
            title: "智能垃圾分类",
            path: "/pages/index/index"
        };
    },
    switchSection: function(t) {
      this.data.secId = t.currentTarget.id.slice(3)
      //console.log(this.data.secId)
      this.setData({
        secId: t.currentTarget.id.slice(3),
        scrollTop: 0
      });
      var map = [
        3, 4, 1, 2
      ]
      this.data.type = map[t.currentTarget.id.slice(3)];
      this.data.page = 0;
      this.updateData();
    },
    //点击图片进入数据样单
    onClick:function(e){
      console.log(JSON.stringify(e))
      var indexClick=parseInt(this.data.secId) + parseInt(1)
      console.log(indexClick)
      var citys=this.data.city
      wx.navigateTo({
        url: '/pages/ai/filter/filter?type='+indexClick.toString()+"&city="+citys
      })
    },
    updateData: function() {
      this.data.dataCount = db.collection('product').where({
        sortId: this.data.type
      }).count()

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
      wx.hideLoading()
      return
    },
    loadMoreItems: function() {
      this.updateData()
    },
    switchToTest: function() {
        wx.switchTab({
            url: "/pages/test/test"
        });
    }
});