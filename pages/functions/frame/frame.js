//Page Object
const app = getApp()
import {blueApi, SET_WIFISSID, SET_WIFIPASSWORD, CONNECT_WIFI, PLAY} from '../../../utils/blueApi.js'
import {isHexadecimal, strToUtf8Bytes, ab2hex, inArray, string2buffer, multiSend} from '../../../utils/util'

Page({
  data: {
    deviceList: '',
    showLoading: true,
    showControl: true,
    sendInfo: "",
    receiveInfo: "",
    timer: null,
    wifiShow: false,
    testShow: false,
    wifiSSID: "",
    dict: {},
    wifiPSD: "",
    testText: "",
    testInfo: "",
    version: "v0.0.30"
  },
  getTest() {
    let data = multiSend("01234567891", "==sd", "==ee")
    this.setData({
      testInfo: data
    })
    console.log("sendInfo---data", data)   
  },
  onUnload() {
    this.closeBluetooth()
  },
  //options(Object)
  onLoad: function(options){
    let that = this
    // that.getTest()
    
    that.setData({
      dict: blueApi
    })
    // 初始化wifi
    wx.startWifi({
      success (res) {
        console.log(res)
      }
    })
    // 获取当前wifiSSID
    wx.getConnectedWifi({
      success: (res)=>{
        let SSID = res.wifi.SSID
        that.setData({
          wifiSSID: SSID
        })
        // 判断是否打开gps
        // that.isGps()
        that.initBlueTooth();
      },
      fail: (err)=>{
        wx.showModal({
          title: '当前没有搜索到wifi',
          content: '请先连接wifi',
          showCancel: false
        })
        return
      },
    });
  },
  // 监听页面显示
  onShow: function(){
    
  },
  // 判断是否打开gps
  isGps() {
    let that = this
    const systemSetting = wx.getSystemSetting()
    let gps = systemSetting.locationEnabled
    console.log("打开gps了吗", gps)
    wx.getSystemSetting({
      success (res) {
     
        let gps=res.locationEnabled;
        // Android端需要打开gps
        if(!gps){
          wx.showModal({
            title: '请打开GPS定位',
            content: '没有GPS定位，可能无法搜索到蓝牙设备',
            showCancel: false
          })
        }else{
          // 初始化蓝牙模块
          that.initBlueTooth();
        }
      },
      fail (err) {
        console.log("打开gps失败", err)
      }
    }) 
  },
  // 过滤空格
  removeSpaces(val) {
    return val.replace(/\s+/g, ''); // 移除所有空格
  },
  // 初始化蓝牙模块
  initBlueTooth() {
    let that = this;
    wx.openBluetoothAdapter({
      mode: 'central',
      success: (res) => {
        // 开始搜索附近的蓝牙外围设备
        that.startSearch();
      },
      fail: (res) => {
        // 没有监听到蓝牙的时候 做提示
        if (res.errCode !== 10001) {
          wx.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          })
        }
        wx.onBluetoothAdapterStateChange(function (res) {
          if (res && res.available) {
            that.startSearch()
          }
        })
      }
    })
  },
  // 开启搜索设备
  startSearch() {
    this.setData({
      deviceList: '',
      index: -1,
      deviceId: null
    })
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        this.getDevice()
      },
    })
  },
  // 停止搜索
  stopSearch() {
    wx.stopBluetoothDevicesDiscovery({
      complete: () => {
        this._discoveryStarted = false
      }
    })
  },
  // 关闭蓝牙
  closeBluetooth() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  // 搜索设备
  getDevice() {
    // ArrayBuffer转16进度字符串示例
    let that = this;
    that.setData({
      showLoading: true,
      deviceList: ''
    })

    // 监听扫描到新设备事件
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        device.status = 0
        const foundDevices = this.data.deviceList
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`deviceList[${foundDevices.length}]`] = device
        } else {
          data[`deviceList[${idx}]`] = device
        }
        
        this.setData(data)
      })
    })
    // 搜索10秒后暂停
    setTimeout(()=> {
      that.stopSearch()
      clearInterval(that.data.timer)
      console.log("deviceList", that.data.deviceList)
      that.setData({
        showLoading: false,
        timer: null
      })
    }, 10000)
  },
  // 连接设备
  bindConnect(e) {
    let that = this;
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const index = ds.index
    that.setData({
      // wifiShow: true,
      // testShow: true,
      deviceId,
      index
    })
    that.createBLEConnection();
  },

  // 连接蓝牙
  createBLEConnection() {
    console.log("-------------------createBLEConnection-------------------")
    let that = this;
    let {deviceList, deviceId, index} = that.data;
    wx.showLoading()
    wx.createBLEConnection({
      deviceId,
      success: () => {
        deviceList[index].status = 1
        that.setData({
          deviceList,
        })
        // 获取服务信息
        that.getServices(deviceId)
        // 监听已连接的蓝牙设备
        // wx.getConnectedBluetoothDevices({
        //   services: ['FEE2'],
        //   success: (res)=>{
        //     console.log("getConnectedBluetoothDevices", res)
        //   },
        //   fail: ()=>{},
        //   complete: ()=>{}
        // });
      },
      complete() {
        wx.hideLoading()
      }
    })
    that.stopSearch()
  },
  // 取消 关闭弹窗
  cancel() {
    this.setData({
      wifiShow: false
    })
  },
  // 获取蓝牙服务信息
  getServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          console.log("-------------------getServices-------------------", res.services )
          // 指定硬件的uuid
          // let uuid = "0000FFF2-0000-1000-8000-00805F9B34FB";
          let uuid = "0000FFF0-0000-1000-8000-00805F9B34FB";   //test
          // if (res.services[i].isPrimary) {
          if (res.services[i].isPrimary && res.services[i].uuid == uuid) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      },
      fail: (err)=> {
        console.log("getServices", err)
      }
    })
  },
  // 获取服务
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    let that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        // let suuid = "0000fff1-0000-1000-8000-00805f9b34fb"
        // let suuid = "0000FFF1-0000-1000-8000-00805F9B34FB"
        let cuuid = "0000FFF2-0000-1000-8000-00805F9B34FB"  // test
        for (let i = 0; i < res.characteristics.length; i++) {
          const item = res.characteristics[i]
          if(item.uuid == cuuid) {
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
          }
          // if (item.properties.read) {
          //   wx.readBLECharacteristicValue({
          //     deviceId,
          //     serviceId,
          //     characteristicId: item.uuid,
          //     success (res) {
          //       console.log('readBLECharacteristicValue:', res.errCode)
          //     }
          //   })
          // }
          // if (item.properties.write) {
          //   this.setData({
          //     canWrite: true
          //   })
          //   this._deviceId = deviceId
          //   this._serviceId = serviceId
          //   this._characteristicId = item.uuid
          //   console.log('write')
          //   // this.sendInfo();
          // }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
              success (res) {
                console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                // 操作之前先监听，保证第一时间获取数据
                wx.onBLECharacteristicValueChange((characteristic) => {
                  // const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
                  // const data = {}
                  // if (idx === -1) {
                  //   data[`chs[${this.data.chs.length}]`] = {
                  //     uuid: characteristic.characteristicId,
                  //     value: ab2hex(characteristic.value)
                  //   }
                  // } else {
                  //   data[`chs[${idx}]`] = {
                  //     uuid: characteristic.characteristicId,
                  //     value: ab2hex(characteristic.value)
                  //   }
                  // }
                  console.log("characteristic", characteristic)
                  // wx.showToast({
                  //   title: '收到从机数据',
                  // })
                  that.setData({
                    receiveInfo: ab2hex(characteristic.value)
                  })
                })
              }
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      },
      complete() {  
        that.isSetWifi();
        that.setData({  
          showControl: true,
        })
        wx.hideLoading()
      }
    })
    
  },

  // 是否已经设置wifi
  isSetWifi() {
    let that = this;
    wx.getStorage({
      key: 'wifidata',
      success: (res)=>{
        // 如果当前wifi和存储的wifi一致，则免wifi连接
        let ssid = that.data.wifiSSID;
        if(ssid !== res.data.ssid) {
          that.setData({
            wifiShow: true
          })
        }else {
          that.setData({
            wifiSSID: res.data.ssid,
            wifiPSD: res.data.password,
          },
          // ()=> {
          //   that.sendInfo(SET_WIFISSID)
          // }
          )
          // setTimeout(()=> {
          //   that.sendInfo(CONNECT_WIFI)
          // }, 1000)
        }
      },
      fail: (err)=>{
        console.log("isSetWifi--err", err)
        that.setData({
          wifiShow: true
        })
      },
    });
  },
  // 判断wifi密码是否正确
  isConnectedWifi() {
    let that = this;
    let {wifiPSD, wifiSSID} = that.data;
    wx.connectWifi({
      SSID: wifiSSID,
      password: wifiPSD, 
      success(res)  {
        console.log("isConnectedWifi",res)
        wx.setStorage({
          key: 'wifidata',
          data: {
            ssid: wifiSSID,
            password: wifiPSD
          },
        });
        that.sendInfo(SET_WIFISSID) // 设置wifi密码
        that.setData({
          wifiShow: false
        }, ()=> {
          that.sendInfo(CONNECT_WIFI)
        }, 1000)
      },
      fail(err) {
        console.log('isConnectedWifi',err)
        if(err.errCode == 12014) {
          wx.showToast({
            title: "密码错误，请重新输入",
            icon: "error"
          })
        }
        if(err.errCode == 12004) {
          // 重复连接
          that.setData({
            wifiShow: false
          })
        }
        // if(err) {
        //   console.log('isConnectedWifi',err)
        // }
      }
    })
  },
  // 指令发送
  instructionClick(e) {
    const {value} = e.currentTarget.dataset;
    console.log("instructionClick---value", value)
    this.sendInfo(value)
  },

   
  /**
 * 将设置的WIFI SSID &连接密码和当前小程序用户的专用Token，通过蓝牙的方式传输到3D相框保存
 * 
 * 注：用户用此操作之前必须登录
 */
  // 向3D相框发送数据
  sendInfo(value) {
    console.log("-------------------sendInfo-------------------")
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk5MjksImlzV2VjaGF0Ijp0cnVlLCJqd3RWZXJzaW9uIjoiMS4wIiwibmlja25hbWUiOiJMbGlhbSJ9.z9uJrnDbfE5LywWaQD1aaTb4B0boS1KXI-q-bR5CMQY"
    let {wifiPSD, wifiSSID} = that.data;
    let testText, buffer;
    if(value == SET_WIFISSID) {
      let str = wifiSSID+'pasw'+wifiPSD;
      if(str.length > 14) {
        let dataArr = multiSend(`${wifiSSID}pasw${wifiPSD}`, "==sd", "==ee") 
        dataArr.forEach((item, index) => {
          setTimeout(() => {
            that.sendHandler(item)
          }, index * 500)
        })
      }else {
        that.sendHandler(`==sd${wifiSSID}pasw${wifiPSD}==ee`)
      }
      // testText = value + wifiSSID + wifiPSD + SET_WIFIPASSWORD
    }else if(value == PLAY){
      let mediaArr = multiSend(token, "==ff", "==ee") 
      mediaArr.forEach((item, index) => {
        setTimeout(() => {
          that.sendHandler(item)
        }, index * 500)
      })
      // testText = value + token
    }else {
      that.sendHandler(value);
    }
   
    // let data = {
    //   token: userInfo.token,
    //   wifiPSD,
    //   wifiSSID
    // }

    // if(isHexadecimal(testText)) {
    //   // 如果是16进制
    //   buffer = new ArrayBuffer(testText.length / 2)
    //   let x = new Uint8Array(buffer)
    //   for (let i = 0; i < x.length; i++) {
    //       x[i] = parseInt(testText.substr(2 * i, 2), 16)
    //   }
    // }else {
    
  },
  sendHandler(testText) {
    let that = this;
    let buffer = new Uint8Array(strToUtf8Bytes(testText)).buffer
    // }

    // const params = JSON.stringify(data);

    // const buffer = string2buffer(testText)
    // const dataView = new DataView(buffer)
    // dataView.setUint8(1, 100)

    console.log(`buffer: ${buffer}`);
    wx.writeBLECharacteristicValue({
      deviceId: that._deviceId,
      serviceId: that._serviceId,
      characteristicId: that._characteristicId,
      value: buffer,
      success(e) {
        console.log(`writeBLECharacteristicValue: 成功---${testText}`)
        that.setData({
          sendInfo: testText+ 'ok'
        })
      },
      fail(e) {
        console.log(`writeBLECharacteristicValue: 失败---${testText}`)
        that.setData({
          sendInfo: testText+ 'fail'
        })
      },
      complete() {
        console.log('writeBLECharacteristicValue: 结束')
      }
    })
  },


  onReady: function(){
    
  },
  
  
  onShareAppMessage: function(){

  },
});