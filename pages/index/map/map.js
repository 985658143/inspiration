// pages/store/store.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasMap: true,                                       // 地图展示开关
    isShow: true,                                        // 地图展开关闭开关
    switchText: '收起地图',                               // 切换文本
    stopBtn: true,                                       // 动画未执行之前禁用按钮
    currentIndex: 0,
    statusBarHeight: app.globalData.statusBarHeight,     // 距离顶部距离
    mapHeight: 520,                                      // 地图高度
    mapOpacity: 1,                                       // 地图透明度
    showAction: false,                                   // 电话弹窗
    actions: [{name: '呼叫'}],                           // 电话弹窗内容         
    store: [],                                           // 初始门店数据
    storeInfo: [
      {
        storeName: "nike",
        shop_name: "nike",
        phone: "112312",
        address: "nike",
        detailed_address: "上海市南京东路新世界",
        latitude: "31.235506",
        business_hours: "9:00~22:00",
        status: "closed",
        longitude: "121.478832"
      },
      {
        storeName: "adidas",
        shop_name: "adidas",
        phone: "124121231",
        address: "adidas",
        detailed_address: "上海市南京东路新世界",
        latitude: "31.23702",
        longitude: "121.484395",
        business_hours: "9:00~22:00",
        status: 'opened',
      }
    ],                                       // 接口门店信息存储
    // nearStore: {},                                       // 附近门店
    // 地图显示的位置
    location: {
      longitude: 0,
      latitude: 0,
    },
    // 标记点(店铺位置)
    markers: [
      {
        id: 1,
        // width: 30,
        // height: 30,
        // longitude: 121.5023,
        // latitude: 31.238149,
        // iconPath: "/assets/store/location.png",
        callout: {
          // content: "最强蜗牛体验店（上海店）",
          color: "#fff",
          bgColor: "#000000",
          borderRadius: 3,
          fontSize: 14,
          padding: 10,
          textAlign: "center",
          display: "ALWAYS",
        },
      },
      // 原写死数据
      // {
      //   id: 2,
      //   width: 30,
      //   height: 30,
      //   longitude: 104.080484,
      //   latitude: 30.65342,
      //   iconPath: "/assets/store/location.png",
      //   callout: {
      //     content: "最强蜗牛体验店（成都店）",
      //     color: "#fff",
      //     bgColor: "#000000",
      //     borderRadius: 3,
      //     fontSize: 14,
      //     padding: 10,
      //     textAlign: "center",
      //     display: "ALWAYS",
      //   },
      // },
    ],
    //路线
    polyline: [
      {
        //0-起点 1-终点
        points: [
          {
            longitude: 0,
            latitude: 0,
          },
          {
            longitude: 0,
            latitude: 0,
          },
        ],
      },
    ],
  },
  // 返回按钮
  returnClick() {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },
  // 电话弹窗打开
  actionCall(e) {
    let _this = this;
    let index = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: _this.data.storeInfo[index].phone,
      fail: err=> {
        console.log(err)
      }
    })
  },
  // 地点导航
  navigate(e) {
    let index = e.currentTarget.dataset.nav;
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let a = Number(this.data.storeInfo[index].latitude);
    let b = Number(this.data.storeInfo[index].longitude);
    
    wx.openLocation({
      latitude: a, // 纬度，范围为-90~90，负数表示南纬
      longitude: b, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
      name: this.data.storeInfo[index].storeName,  // 位置名
      address: this.data.storeInfo[index].address, // 地址的详细说明
      success: res=> {
        console.log(res);
        wx.hideLoading();
      },
      fail: res=> {
        // fail
        console.log(res);
      },
    })
  },
  // 获得用户位置坐标
  async getLocation() {
    const that = this;
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    //获取经纬度信息
    //注：wx.getLocation只能调起一次用户授权，拒绝后不会再次调用
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        wx.hideLoading();
        that.setData({
          [`polyline[${0}].points[${0}]`]: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          hasMap: true,
        });
        // 调用接口
        let params = {
          lat: res.latitude,
          lng: res.longitude
        }

        that.setData({ 
          [`store[${0}].latitude`]: that.data.storeInfo[0].latitude,
          [`store[${0}].shop_name`]: that.data.storeInfo[0].shop_name,
          [`store[${0}].longitude`]: that.data.storeInfo[0].longitude,
        })
        that.getStoresLen();

        
        // app.api.getStore(params).then( res=> {
        //   console.log(res)
        //   if(res.code == 200) {
        //     that.setData({ 
        //       storeInfo: res.data.data,
        //       [`store[${0}].latitude`]: res.data.data[0].latitude,
        //       [`store[${0}].shop_name`]: res.data.data[0].shop_name,
        //       [`store[${0}].longitude`]: res.data.data[0].longitude,
        //     })
        //     console.log(that.data.store)
        //     that.getStoresLen();
        //   }else {
        //     // console.log("存储失败",res)
        //   }
        // })
        //计算与门店的距离
        
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res, "获取地理位置失败");
      },
    });
  },
  // 计算用户与门店的距离
  getStoresLen() {
    let store = this.data.store;
    if (store.length === 0) {
      return;
    }
    // 初始化地图数据
    this.setData({
      location: store[0], // 地图定位到最近门店的位置
      store,
      // nearStore: store[0],
      [`markers[${0}].latitude`]: store[0].latitude,
      [`markers[${0}].longitude`]: store[0].longitude,
      [`markers[${0}].callout.content`]: store[0].shop_name,
      [`polyline[${0}].points[${1}]`]: {
        latitude: store[0].latitude,
        longitude: store[0].longitude,
      },
    });
    // this.includePoints();
  },
  // 回到用户位置
  // clickControl() {
  //   this.mapCtx.moveToLocation();
  // },
  // 两点之间的距离计算
  // getDistance(la1, lo1, la2, lo2) {
  //   var La1 = (la1 * Math.PI) / 180.0;
  //   var La2 = (la2 * Math.PI) / 180.0;
  //   var La3 = La1 - La2;
  //   var Lb3 = (lo1 * Math.PI) / 180.0 - (lo2 * Math.PI) / 180.0;
  //   var s =
  //     2 *
  //     Math.asin(
  //       Math.sqrt(
  //         Math.pow(Math.sin(La3 / 2), 2) +
  //           Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)
  //       )
  //     );
  //   s = (s * 6378137) / 1000;

  //   return s;
  // },
  // 切换门店
  changeStore(e) {
    const index = e.currentTarget.dataset.index;
    let storeInfo = this.data.storeInfo;
    this.setData({
      [`location.latitude`]: storeInfo[index].latitude,
      [`location.longitude`]: storeInfo[index].longitude,
      // 切换门店后，根据接口提供的数据，改变标记点数据 
      [`markers[${index}].latitude`]: storeInfo[index].latitude,
      [`markers[${index}].longitude`]: storeInfo[index].longitude,
      [`markers[${index}].callout.content`]: storeInfo[index].shop_name,
      [`markers[${index}].callout.bgColor`]: "#000000",
      [`markers[${index}].callout.borderRadius`]: 3,
      [`markers[${index}].callout.color`]: "#fff",
      [`markers[${index}].callout.display`]: "ALWAYS",
      [`markers[${index}].callout.fontSize`]: 14,
      [`markers[${index}].callout.padding`]: 10,
      [`markers[${index}].callout.textAlign`]: "center",
      currentIndex: index
    })
    console.log(this.data.markers);
  },
  //将两点缩放显示在地图上
  // includePoints() {
  //   const location = this.data.location;
  //   const marker = this.data.markers[0];
  //   this.mapCtx.includePoints({
  //     padding: [80],
  //     points: [
  //       {
  //         latitude: location.latitude,
  //         longitude: location.longitude,
  //       },
  //       {
  //         latitude: marker.latitude,
  //         longitude: marker.longitude,
  //       },
  //     ],
  //   });
  // },
  // 用户重新授权
  authLocation() {
    wx.getSetting({
      success: (res) => {
        if (
          res.authSetting["scope.userLocation"] != undefined &&
          res.authSetting["scope.userLocation"] == true
        ) {
          this.setData({
            hasMap: true,
          });
          this.getLocation();
        } else {
          this.setData({
            hasMap: false,
          });
          this.getLocation();
        }
      },
    });
  },
  // 展开地图
  showContent(e) {
    this.setData({
      stopBtn: true,
      switchText: "收起地图",
      mapHeight: 520,
      mapOpacity: 1,
    })
},
  // 收起地图
  hideContent(e) {
    this.setData({
      stopBtn: false,
      switchText: "展开地图",
      mapHeight: 0,
      mapOpacity: 0,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
    this.mapCtx = wx.createMapContext("map");
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.authLocation();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取绑定角色信息
    // wx.getStorage({
    //   key: 'playerInfo',
    //   success: res=> {
    //     // success
    //     console.log(res)
    //   },
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
