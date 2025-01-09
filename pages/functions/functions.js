//Page Object
const app = getApp()  
Page({
  data: {
    menuList: [
      {
        id: 1,
        url: "/pages/frame/frame",
        title: "蓝牙",
        open: false,
      },
      {
        id: 2,
        url: "/pages/index/map/map",
        title: "gsplat模型预览",
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
      wx.navigateTo({
        url: this.data.menuList[id].url
      })
  }
});