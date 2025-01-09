//Page Object
const app = getApp()  
import {menuList} from '../../utils/menu'
Page({
  data: {
    menuList: menuList.component
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