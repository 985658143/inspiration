//Page Object
const app = getApp()  
Page({
  data: {
    menuList: [
      {
        id: 1,
        url: "/pages/index/address/address",
        title: "地址管理组件",
        open: false,
      },
      {
        id: 2,
        url: "/pages/index/map/map",
        title: "地图门店组件",
        open: false,
      },
      {
        id: 3,
        url: "/pages/index/richText/richText",
        title: "富文本输入组件",
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