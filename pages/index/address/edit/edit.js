const app = getApp();
import { areaList } from "..//@vant/weapp/area-data/dist/index.cjs";
Page({
  data: {
    isCover: false, // 防抖
    showArea: false, // 省份列表打开
    checked: true, // 默认地址选择
    baseInfo: "", // 本地存储baseInfo
    dialogShow: false, // 确认框开关
    addressInfo: {}, // 原地址信息
    id: 0, // 地址id
    // 地址填写信息
    inputData: {
      receive_contact: "",
      receive_mobile: "",
      province: "",
      receive_address: "",
    },
    areaList,
  },
  // 返回
  returnClick() {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    });
  },
  // 默认地址选择
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  // 表单数据提交
  formSubmit(e) {
    console.log("formSubmit", e);
    let params = e.detail.value;
    let addressInfo = this.data.addressInfo;
    if (!params.receive_contact) {
      wx.showToast({
        icon: "none",
        title: "姓名不能为空",
      });
      return false;
    }
    if (
      !addressInfo.province_name ||
      !addressInfo.city_name ||
      !addressInfo.county_name
    ) {
      wx.showToast({
        icon: "none",
        title: "请选择您所在的省、市、区",
      });
      return false;
    }
    if (!params.receive_address) {
      wx.showToast({
        icon: "none",
        title: "请填写您的详细地址",
      });
      return false;
    }
    let reg =
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!reg.test(params.receive_mobile)) {
      wx.showToast({
        icon: "none",
        title: "手机号格式不正确，请重新输入",
      });
      return false;
    }
    params["id"] = addressInfo.id;
    params["is_default"] = this.data.checked == true ? 1 : 0;
    this.updateAddress(params);
  },
  updateAddress(params) {
    let addressInfo = this.data.addressInfo;
    const u = wx.getStorageSync("userInfo");
    let info = {
      open_id: u.openid,
      union_id: u.unionid,
    };
    let obj = {
      ...params,
      ...info,
      province_id: addressInfo.province_id,
      county_id: addressInfo.county_id,
      city_id: addressInfo.city_id,
      province_name: addressInfo.province_name,
      city_name: addressInfo.city_name,
      county_name: addressInfo.county_name,
    };
    if (addressInfo.id) {
      app.api.addressUpdate(obj).then((res) => {
        if (res.code == 1000) {
          // 返回地址页
          this.setData({
            isCover: true,
          });
          setTimeout(() => {
            this.returnClick();
            this.setData({
              isCover: false,
            });
          }, 1500);
        }
        wx.showToast({
          icon: "none",
          title: res.message,
        });
      }).catch(err=> {
        wx.showToast({
          icon: "none",
          title: err,
        });
      })
    } else {
      // 新增地址
      app.api.addressAdd(obj).then((res) => {
        if (res.code == 1000) {
          // 返回地址页
          this.setData({
            isCover: true,
          });
          setTimeout(() => {
            this.returnClick();
            this.setData({
              isCover: false,
            });
          }, 1500);
        }
        wx.showToast({
          icon: "none",
          title: res.message,
        });
      }).catch(err=> {
        wx.showToast({
          icon: "none",
          title: err,
        });
      })
    }
  },
  // 关闭省市区弹窗
  closeArea() {
    this.setData({
      showArea: false,
    });
  },
  // 打开弹出层
  openArea() {
    this.setData({
      showArea: true,
    });
  },
  // 省份选择
  areaClick(e) {
    let province = e.detail.values;
    console.log("areaClick", province);
    this.setData({
      /** */
      [`addressInfo.province_name`]: province[0].name,
      [`addressInfo.province_id`]: province[0].code,
      [`addressInfo.city_name`]: province[1].name,
      [`addressInfo.city_id`]: province[1].code,
      [`addressInfo.county_name`]: province[2].name,
      [`addressInfo.county_id`]: province[2].code,

      showArea: false,
    });
  },
  // 获取原地址信息
  getAddressInfo() {
    let _this = this;
    const u = wx.getStorageSync("userInfo");
    let params = {
      id: this.data.id,
      open_id: u.openid,
      union_id: u.unionid,
    };
    app.api.addressInfo(params).then((res) => {
      console.log(res);
      if (res.code == 1000) {
        let addressInfo = res.data;
        let checked = addressInfo.is_default == 1 ? true : false;
        _this.setData({
          addressInfo,
          checked,
        });
      } else {
        wx.showToast(res.message);
      }
    });
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    let _this = this;
    console.log(options);
    if (options.id) {
      wx.setNavigationBarTitle({
        title: "修改收件地址",
      });
    } else {
      wx.setNavigationBarTitle({
        title: "添加收件地址",
      });
    }
    _this.setData(
      {
        id: options.id,
      },
      () => {
        options.id ? _this.getAddressInfo() : "";
      },
      200
    );
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
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
    //     wx.showToast("授权已过期，请重新进入小程序");
    //   },
    // })
  },
});
