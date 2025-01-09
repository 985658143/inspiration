const app = getApp();

Page({
  data: {
    imgList: "",                                            // 图片预览列表
    arrList: [
      {
        id: 1,
        img_url: "/static/images/waterfall/t1.png",
      },
      {
        id: 2,
        img_url: "/static/images/waterfall/t2.png",
      },
      {
        id: 3,
        img_url: "/static/images/waterfall/t3.png",
      },
      {
        id: 4,
        img_url: "/static/images/waterfall/t4.png",
      },
      {
        id: 5,
        img_url: "/static/images/waterfall/t5.png",
      },
      {
        id: 6,
        img_url: "/static/images/waterfall/t6.png",
      },
    ],                                                      // 图片完整信息列表
    deleteList: "",                                         // 删除图片数组
    member: 0,                                              // 员工判断
    status: true,                                           // 删除模式状态切换
    isCover: false,                                         // 蒙版
    page: 0,                                                // 当前页面
    last_page: 0,                                           // 最后一页
  },
  // 添加图片
  addImg() {
    var that = this;
    wx.chooseMedia({
      count: 1, //最多可以选择的图片总数
      chooseMedia: ["image"],
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        console.log(res);
        wx.showLoading({
          title: "正在上传中...",
          mask: true,
        });
        that.setData({
          imgList: that.data.imgList.concat(res.tempFiles[0].tempFilePath),
          arrList: [{
            id: that.data.arrList.length + 1,
            img_url: res.tempFiles[0].tempFilePath
          }, ...that.data.arrList],
        }, ()=> {
          console.log("")
          wx.showToast({
            title: "上传成功",
            icon: "none",
            duration: 1500,
          });
        });
        
        // 上传图片到 服务器
        // wx.uploadFile({
        //   url: "https://tapi.qingcigame.com/xxd/upload",
        //   filePath: tempFilePaths[0],
        //   name: "file",
        //   formData: {},
        //   header: {
        //     "Content-Type": "multipart/form-data",
        //   },
        //   success: function (res) {
        //     // 转换json格式
        //     var data = JSON.parse(res.data);
        //     console.log(data);
        //     var path = data.data.path;
        //     var phone = that.data.member.phone;

        //     //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
        //     // 获取图片
        //     app.api.getPicture(path, phone).then((res) => {
        //       console.log(res);
        //       wx.hideLoading();
        //       if (res.code == 200) {
        //         that.setData({
        //           imgList: that.data.imgList.concat(path),
        //         });
        //         wx.showToast({
        //           title: "上传成功",
        //           icon: "none",
        //           duration: 1500,
        //         });

        //         // 刷新页面数据
        //         that.onLoad();
        //       } else {
        //         wx.showToast({
        //           title: res.message,
        //           icon: "none",
        //           duration: 1500,
        //         });
        //       }
        //     });
        //   },
        //   fail: function (res) {
        //     wx.hideToast();
        //     wx.showModal({
        //       title: "错误提示",
        //       content: "上传图片失败",
        //       showCancel: false,
        //       success: function (res) {},
        //     });
        //   },
        // });
        
      },
    });
  },
  // 图片预览
  previewImg(e) {
    let _this = this;
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: _this.data.imgList[index],     // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: _this.data.imgList,               //  url[0] 只能是string类型
      showmenu: false,                        // 禁止保存图片和转发
      success: (res) => {
        // success
        console.log(res)
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },
  // 删除图片模式切换
  changeStatus() {
    this.setData({
      status: !this.data.status
    })
  },
  // 多选图片框
  checkboxChange(e) {
    let arr = e.detail.value;
    arr = arr.map(el=> parseInt(el))
    this.setData({
      deleteList: arr
    })
  },
  // 删除图片确认
  deleteImg() {
    let _this = this;
    let {arrList, deleteList} = _this.data;
    wx.showLoading({
      title: "删除中",
      mask: true,
    }); 
    let arr = arrList.filter(el => !deleteList.includes(parseInt(el.id)))
    _this.setData({
      arrList: arr
    }, ()=> {
      wx.showToast({
        title: "删除成功",
        icon: "none",
        duration: 1500,
      });
    })
    _this.changeStatus() ;
    // app.api.deletePicture(data).then( res=> {
    //   if(res.code == 200) {
    //     wx.showToast({
    //       title: "删除成功",
    //       icon: "none",
    //       duration: 1500,
    //     });
    //     // 刷新页面数据
    //     _this.onLoad();
    //     // 删除按钮切换
    //     _this.changeStatus() ;
    //   }else {
    //     wx.showToast({
    //       title: res.message,
    //       icon: "none",
    //       duration: 1500,
    //     });
    //   }
    //   _this.setData({ isCover: true })
    //   setTimeout(()=>{
    //     _this.setData({ isCover: false })
    //   },1500)
    //   wx.hideLoading();
    // })
  },
  // 界面触底，图片懒加载
  onReachBottom: function () {
    let params = {};
    let a = this.data.page;
    a++;
    this.setData({
      page: a
    })
    if(this.data.page > this.data.last_page) {
      // 如果下一页到底 则不请求接口
      return false
    }else {
      params["page"] = a;
      // app.api.pictureList(params).then((json) => {
      //   if (json.code == 200) {
      //     let list = json.data.picture_wall.data;
      //     let arr = this.data.imgList;
      //     let arr2 = this.data.arrList;
      //     list.forEach((element) => {
      //       element["checked"] = false;
      //       arr.push(element.img_url)
      //       arr2.push(element)
      //     });
      //     this.setData({
      //       imgList: arr,
      //       arrList: arr2
      //     });
      //   } else {
      //     wx.showToast({
      //       title: json.message,
      //       icon: "none",
      //       duration: 1500,
      //     });
      //   }
      // });
    }
    
  },
  onLoad() {
    // 生命周期函数--监听页面加载
    // 初始化图片列表
    // app.api.pictureList().then((json) => {
    //   console.log(json.data.picture_wall.data);
    //   if (json.code == 200) {
    //     let list = json.data.picture_wall.data;
        let arr = [];
        this.data.arrList.forEach((element) => {
          element["checked"] = false;
          arr.push(element.img_url)
        });
        this.setData({
          imgList: arr,
          // page: json.data.picture_wall.current_page,
          // last_page: json.data.picture_wall.last_page
        });
        console.log("imgList", arr)
    //   } else {
    //     wx.showToast({
    //       title: json.message,
    //       icon: "none",
    //       duration: 1500,
    //     });
    //   }
    // });
  },
  onShow() {
    // 生命周期函数--监听页面显示
  },
});
