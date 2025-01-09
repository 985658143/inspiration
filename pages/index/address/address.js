const app = getApp();
Page({
  data:{
    currentIndex: false,                                 // 编辑地址
    moreHeight: 140,                        
    isCover: false,                                      // 防抖
    editShow: false,                                     // 编辑栏展开
    baseInfo: "",                                        // 本地存储baseInfo
    address_list: [
      {
        id: 1,
        receive_contact: "张三",
        receive_mobile: "12345678901",
        receive_address: "广东省广州市天河区",
        city_name: "广州市",
        county_name: "天河区",
        province_name: "广东省",
        shop_id: 1,
        is_default: 1
      }
    ],                                    // 地址列表  
    addressId: 0,                                        // 地址id
    select: false,                                        // 地址id
    dialogShow: false,                                   // 确认框开关
    current_id: 0,                                   // 删除的门店id
    shop_id: 0,                                      // 当前的门店id
  },
  // 编辑地址
  controlEdit() {
    let index = this.data.currentIndex;
    let editShow = this.data.editShow;
    this.setData({
      currentIndex: !index,
      editShow: !editShow
    })
  },
  // 删除确认
  tapDialogButton(e) {
    this.deleteConfirm();
    this.setData({
      dialogShow: false,
    })
  },
  // 修改地址信息
  editClick(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/address/edit/edit?id=' + id,
    })
  },
  // 删除点击
  deleteClick(e) {
    const id = e.currentTarget.dataset.id;
    const sid = e.currentTarget.dataset.sid;
    this.setData({
      dialogShow: true,
      addressId: id,
      current_id: sid
    })
  },
  // 确定删除
  deleteConfirm() {
    let id = this.data.addressId;
    const u = wx.getStorageSync('userInfo');
    let params = {
      id: id,
      open_id: u.openid,
      union_id: u.unionid,
    }
    if(this.data.current_id > 0) {
      setTimeout(()=> {
        wx.showToast({
          title: "门店地址不可删除",
          icon: "error"
        })
      }, 500)
      return false
    }
     app.api.deleteAddress(params).then(res=>{
      console.log(res)
      if(res.code == 1000) {
        this.setData({
          isCover: true
        })
        setTimeout(()=> {
          this.setData({
            isCover: false
          })
        }, 2000)
        wx.showToast({
          icon: 'none',
          title: res.message
        });
        setTimeout(()=> {
          this.getAddress();
        }, 200)
      }
    })
  },
  // 获取所有收件信息
  getAddress() {
    let _this = this;
    const u = wx.getStorageSync('userInfo');
    let obj = {
        shop_id: this.data.shop_id,
        pid: this.data.pid,
        open_id: u.openid,
        union_id: u.unionid,
    }

    // app.api.addressList(obj).then(res=> {
    //   console.log(res)
    //   if(res.code == 1000) {
    //     let address_list = res.data;
    //     _this.setData({
    //       address_list
    //     })
    //   }else {
    //     wx.showToast({
    //       icon: 'none',
    //       title: res.message
    //     });
    //   }
    // })
  },
  onSelect(e) {
    if(this.data.editShow || this.data.select) {
      return false
    }
    const data = e.currentTarget.dataset.item;
    // const prevPage = getCurrentPages()[getCurrentPages().length - 2];
    // prevPage.setData({
    //   id: data.id,
    //   receive_contact: data.receive_contact,
    //   receive_mobile: data.receive_mobile,
    //   receive_address: data.receive_address,
    //   city_name: data.city_name,
    //   county_name: data.county_name,
    //   province_name: data.province_name,
    //   shop_id: data.shop_id,
    // });
    // wx.navigateBack()
  },
  onLoad:function(options){
    // this.setData({
    //   addressId: options.id,
    //   shop_id: options.shopid,
    //   pid: options.pid,
    //   select: options.select
    // })
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    let _this = this;
    // wx.getStorage({
    //   key: 'token',
    //   success: function(res){
    //     // success
    //     _this.token = res.data;
    //   },
    //   fail: function() {
    //     // fail
    //     wx.showToast({
    //       icon: 'error',
    //       title: "授权已过期，请重新进入小程序"
    //     });
    //   },
    // })
    _this.getAddress();
    
  },
});