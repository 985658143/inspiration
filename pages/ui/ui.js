//Page Object
const app = getApp()  
Page({
  data: {
    menuList: [
      {
        id: 1,
        url: "",
        title: "vip中心",
        open: false,
      },
      {
        id: 2,
        url: "",
        title: "朋友圈列表",
        open: false,
      },
      {
        id: 3,
        url: "",
        title: "多宫格图片",
        open: false,
      },
      {
        id: 4,
        url: "/pages/ui/waterfallPhoto/waterfallPhoto",
        title: "瀑布流照片墙组件",
        open: false,
      },
      {
        id: 5,
        url: "",
        title: "个人资料",
        open: false,
      },
      {
        id: 6,
        url: "",
        title: "商品详情",
        open: false,
      },
    ]
  },
  //options(Object)
  onLoad: function(options){
    
  },
  onReady: function(){
    
  },
  onShow: function(){
    
  },
  // 菜单跳转
  routerTo(e) {
    const {id} = e.currentTarget.dataset;
    console.log("routerTo", id)
    if(this.data.menuList[id].url) {
      wx.navigateTo({
        url: this.data.menuList[id].url
      })
    }
  }
});