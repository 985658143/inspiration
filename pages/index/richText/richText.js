const app = getApp();
Page({
  data:{
    statusBarHeight: app.globalData.statusBarHeight,     // 距离顶部距离
    bottomHeight: 0,
    moreTop: 22,
    moreHeight: 140,
    isCover: false,                                      // 防抖
    isUp: false,                                         // 是否升起键盘
    titleText: "投稿",                                   // 导航栏标题 
    isColor: true,                                       // 导航栏字体颜色                            
    isEmoji: false,                                      // 表情切换
    isFirst: false,                                      // 是否已上传一张图片
    total_img: [],                                       // 总图片数
    titleData: "",                                       // 帖子标题存储
    game: 0,                                             // 游戏id
    format: {},                                          // 帖子内容
    formats: {},                                         // 帖子内容
    tem_img: "",                                         // 临时选择的图片
    editorHeight: 300,                                   // 编辑器高度
    keyboardHeight: 0,                              
    isIOS: false,                                        // ios判断
    popShow: false,                                      // 颜色弹窗打开
    popShow2: false,                                     // 文字弹窗打开
    currentIndex: 0,                                     // 帖子分类切换
    currentNode: -1,                                     // 字体编辑选择
    currentId: 3,                                        // 帖子默认类型
    isChoose: false,                                     // 选择游戏
    currentList: {},                                     // 当前游戏列表
    gameList: {},                                        // 所有游戏列表
    followList: {},                                      // 关注的游戏列表
    // 表情列表
    emojiList: "",
    // 帖子分类列表
    sorts: [
      // {
      //   id: 1,
      //   name: '公告',
      // },
      {
        id: 3,
        name: '攻略',
      },
      {
        id: 2,
        name: '闲聊', // 闲聊
      }
    ],
     // 文字编辑功能列表
    fontList: [
      {
        
        id: 1,
        func: "bold",
        status: false,
      },
      {
        
        id: 2,
        func: "italic",
        status: false,
      },
      {
        
        id: 3,
        func: "underline",
        status: false,
      }
    ],
    // 颜色列表
    colorList: [
      {
        id: 1,
        color: "#c00000"
      },
      {
        id: 2,
        color: "#ff0000"
      },
      {
        id: 3,
        color: "#ffc000"
      },
      {
        id: 4,
        color: "#ffff00"
      },
      {
        id: 5,
        color: "#92d050"
      },
      {
        id: 6,
        color: "#00b050"
      },
      {
        id: 7,
        color: "#00b0f0"
      },
      {
        id: 8,
        color: "#0070c0"
      },
      {
        id: 9,
        color: "#002060"
      },
      {
        id: 10,
        color: "#7030a0"
      },
      {
        id: 11,
        color: "#000000"
      },
    ],
    // 字体大小列表
    sizeList: [
      {
        font: "大",
        value: '30px'
      },
      {
        font: "中",
        value: '24px'
      },
      {
        font: "小",
        value: '18px'
      },
    ]
  },
  // 返回
  returnClick() {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },
  // 帖子类型选择
  switchSort(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentIndex: index,
      currentId: id
    })
  },
  // 帖子标题绑定
  bindTitle(e) {
    this.setData({
      titleData: e.detail.value
    })
  },
  // 帖子内容绑定
  bindContent(e) {
    let val = e.detail.html;
    // var arr = [];
    // 提取多张缩略图
    // val.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {         
    //   arr.push(capture);
    // });
    
    this.setData({
      format: val,
      // total_img: arr
    })
  },
  // 打开表情面板
  emojiClick() {
    this.setData({
      isEmoji: !this.data.isEmoji
    })
  },
  // 表情选择
  emojiChoose(e) {
    let that = this;
    const url = e.currentTarget.dataset.url;
    // that.setData({
    //   tem_img: url,
    // })
    that.editorCtx.insertImage({
      src: url,
      // data: {
      //   name: 'emoji'
      // },
      width: '50rpx',
      height: '50rpx',
      success: function () {
        console.log('insert image success')
      }
    })
    this.setData({
      isEmoji: false
    })
  },
  // 游戏判断
  judgeGame(val){
    // 获取游戏列表
    app.api.gameList().then(res=> {
      console.log(res)
      if(res.code == 200) {
        let arr = res.data.game_list;
        let online = arr.online;
        let list = {};
        online.map((item)=> {
          if(item.game_id == val) {
            list = item
            return 
          }
        })
        this.setData({
          currentList: list,
          gameList: online,
        })
      }else {
        // wx.showToast(res.message)
      }
    })
  },
  // 切换游戏
  switchClick() {
    let data = this.data.isChoose;
    this.setData({
      isChoose: !data
    })
  },
  // 游戏选择
  gameClick(e) {
    let data = e.currentTarget.dataset.item;
    this.setData({
      game: data.game_id,
      currentList: data,
      isChoose: !this.data.isChoose
    })
  },
  // 插入图片
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        wx.uploadFile({
          url: 'https://api.qingcigame.com/community/wechat/upload',
          filePath: res.tempFilePaths[0],
          name:'file',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data",
          },
          success: function(res){
            // success
            // 转换json格式
            var data = JSON.parse(res.data);
            let val = that.data.isFirst;
            // 判断是否已传过图片
            if(!val) {
              // 如果没传过图片 则当做封面图
              that.setData({
                tem_img: data.data.path,
                isFirst: true
              })
            }
            console.log(data);
            that.editorCtx.insertImage({
              src: data.data.path,
              id: 1,
              success: function () {
                console.log('insert image success')
              }
            })
          },
          fail: function() {
            // fail
            wx.hideToast();
            wx.showModal({
              title: "错误提示",
              content: "上传图片失败",
              showCancel: false,
              success: function (res) {},
            });
          },
        })
        
      }
    })
  },
  // 发表帖子
  postClick() {
    return
    let id = this.data.currentId;
    let params = {
      "game_id": this.data.game,
      "type": id,
      "title": this.data.titleData,
      "content": this.data.format,
      "user_token": this.token,
      "image": [this.data.tem_img]
    }
    console.log(params)
    app.api.addPost(params).then(res=> {
      console.log(res)
      if(res.code == 200) {
        // 发布成功 返回上一级
        setTimeout(()=> {
          this.returnClick();
        },1500)
      }
      this.setData({ isCover: true })
        setTimeout(()=>{
          this.setData({ isCover: false })
        },1500)
       wx.showToast(res.message)
    })
  },
  // 更新键盘位置
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getDeviceInfo()
    let editorHeight = 0
    if(keyboardHeight > 0) {
      editorHeight = windowHeight - keyboardHeight - toolbarHeight
      this.setData({ editorHeight, keyboardHeight, isUp: true })
    }else {
      editorHeight = windowHeight
      this.setData({ keyboardHeight : 0, isUp: false })
    }
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#content').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  
  // 内容修改
  format(e) {
    let { name, value } = e.target.dataset
    console.log(e)
    if (!name) return
    this.editorCtx.format(name, value)
  },
  onFocus(e) {
    console.log(e)
  },
  onStatusChange(e) {
    console.log(e)
    const formats = e.detail
    let list = this.data.fontList
    formats.bold  == "strong" ? list[0].status = true : list[0].status = false
    formats.italic  == "em" ? list[1].status = true : list[1].status = false
    formats.underline  == true ? list[2].status = true : list[2].status = false
    console.log(list)
    this.setData({ 
      formats,
      fontList: list
     })
  },
  // 按钮状态变化
  funcClick(e) {
    const id = e.currentTarget.dataset.id;
    let list = this.data.fontList;
    list[id -1].status = !list[id -1].status;
    this.setData({
      fontList: list
    })
    console.log(list)
    this.colorClose();
    this.closeFont();
  },
  // 字体气泡框打开
  sizeClick() {
    let data = this.data.popShow2
    this.setData({
      popShow2: !data
    })
    this.colorClose();
  },
  // 字体大小选择
  sizeChoose(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      currentNode: index
    })
    this.closeFont();
  },
  // 颜色气泡框打开
  colorClick() {
    let data = this.data.popShow
    this.setData({
      popShow: !data
    })
    this.closeFont();
  },
  // 颜色气泡框关闭
  colorClose() {
    this.setData({
      popShow: false
    })
     
  },
  // 字体气泡框关闭
  closeFont() {
    this.setData({
      popShow2: false
    })
  },
  // 富文本失焦 键盘回落
  onBlur() {
    this.updatePosition(0)
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    // 初始配置
    const platform = wx.getDeviceInfo().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight  - 87)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
       
    })
  },
  
  onReady () {
    setTimeout(() => {
    let query = wx.createSelectorQuery();
    query.select('.edit_box').boundingClientRect(rect=>{
      let height = rect.height;
      this.setData({
        bottomHeight: height
      })
      }).exec();
    }, 300)
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    let _this = this;
    if(app.globalData.statusBarHeight <=20) {
      this.setData({
        moreTop: 25,
      })
    }
    let params = {
      "game_id": _this.data.game,
      "type": 0
    }
    wx.getStorage({
      key: 'baseInfo',
      success: function(res){
        // success
        let followList = res.data.game_list;
        _this.setData({
          followList
        })
      },
      fail: err=> {
        // fail
        _this.setData({
          baseInfo: ""
        })
      },
    })
 
    // 获取表情列表
    // app.api.getEmoji({type: "1"}).then(res => {
    //   _this.setData({
    //     emojiList: res.data.expression
    //   })
    // })
  },
});