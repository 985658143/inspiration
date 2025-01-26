//------------------ 1. wifi ------------------
export const  SET_WIFISSID = '==sd'        // + wifiname
export const  SET_WIFIPASSWORD = '==ee'     // + password
export const  CONNECT_WIFI = 'wifi611'      // 连接wifi
export const  DISCONNECT_WIFI = 'wifi622'   // 断开wifi
export const  CLEAR_WIFI = 'wifi655'        // 清除wifi记忆
//------------------ 2. 音频 ------------------
export const  STOP_MP4 = 'm711'             // 暂停视频
export const  PLAY_MP4 = 'm722'             // 播放视频
export const  FAST_FORWARD = 'm733'         // 快进10秒
export const  BACKWARD = 'm755'             // 后退10秒
export const  NEXT_SONG = 'm766'             // 下一首
export const  PREVIOUS_SONG = 'm777'         // 上一首
export const  ADD_VOLUME = 's611'           // 音量加10
export const  DEE_VOLUME = 's622'           // 音量减10
export const  VOLUME_SWITCH = 's655'        // 声音开关

//------------------ 3. 灯光 ------------------
export const  BACKLIGHT1 = 'bk000'          // 背光1
export const  BACKLIGHT2 = 'bk050'          // 背光2
export const  BACKLIGHT3 = 'bk100'          // 背光3
//-------------------4. 功能 -------------------
export const UPDATELIST = "update"          // 更新数据列表
export const SHUTDOWN = "power000"          // 关机
export const RESTRART = "power010"          // 重启

export const PLAY = "d311"                  // 发送token
export const DOWNLOAD = "dd001"             // 下载数据
export const DELETEFILE = "dd019"           // 删除下载数据
export const PLAYDATA = "dd010"             // 播放下载数据

export const blueApi = [
  //------------------ 1. wifi ------------------
  // {
  //   id: 1,
  //   title: '设置wifissid名称', 
  //   value: 'ssidn', // + wifiname
  // },
  // {
  //   id: 2,
  //   title: '设置wifipassword名称', 
  //   value: 'pasn', // + password
  // },  
  {
    id: 20,
    title: '请求数据', 
    value:  PLAY
  },  
  {
    id: 21,
    title: '下载数据', 
    value:  DOWNLOAD
  },  
  {
    id: 22,
    title: '删除数据', 
    value:  DELETEFILE
  },  
  {
    id: 15,
    title: '更新数据', 
    value:  UPDATELIST
  },  
  {
    id: 23,
    title: '播放数据', 
    value:  PLAYDATA
  },  
  {
    id: 3,
    title: '连接wifi', 
    value: SET_WIFISSID, 
  },  
  {
    id: 4,
    title: '断开wifi', 
    value: DISCONNECT_WIFI, 
  },  
  {
    id: 5,
    title: '清除wifi记忆', 
    value:  CLEAR_WIFI,
  },  
//------------------ 2. 音频 ------------------
  {
    id: 6,
    title: '暂停视频', 
    value:  STOP_MP4,
  },  
  {
    id: 7,
    title: '播放视频', 
    value:  PLAY_MP4,
  },  
  {
    id: 8,
    title: '快进10秒', 
    value:  FAST_FORWARD, 
  },  
  {
    id: 9,
    title: '后退10秒', 
    value:  BACKWARD,
  },  
  {
    id: 10,
    title: '下一首', 
    value:  NEXT_SONG,
  },  
  {
    id: 11,
    title: '上一首', 
    value:  PREVIOUS_SONG,
  }, 
  {
    id: 12,
    title: '音量加10', 
    value:  ADD_VOLUME,
  },  
  {
    id: 13,
    title: '音量减10', 
    value:  DEE_VOLUME,
  }, 
  {
    id: 14,
    title: '声音开关', 
    value:  VOLUME_SWITCH,
  }, 
  
//------------------ 3. 灯光 ------------------
  {
    id: 15,
    title: '背光1', 
    value:  BACKLIGHT1,
  },  
  {
    id: 16,
    title: '背光2', 
    value:  BACKLIGHT2,
  },  
  {
    id: 17,
    title: '背光3', 
    value:  BACKLIGHT3
  },  
  //-------------------4. 功能 -------------------
  {
    id: 18,
    title: '关机', 
    value:  SHUTDOWN
  },  
  {
    id: 19,
    title: '重启', 
    value:  RESTRART
  },  
]