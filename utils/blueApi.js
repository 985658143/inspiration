//------------------ 1. wifi ------------------
export const  SET_WIFISSID = 'ssidn'        // + wifiname
export const  SET_WIFIPASSWORD = 'pasn'     // + password
export const  CONNECT_WIFI = 'wifi611'      // 连接wifi
export const  DISCONNECT_WIFI = 'wifi622'   // 断开wifi
export const  CLEAR_WIFI = 'wifi655'        // 清除wifi记忆
//------------------ 2. 音频 ------------------
export const  STOP_MP4 = 'm711'             // 暂停播放MP4
export const  PLAY_MP4 = 'm722'             // 继续播放MP4
export const  FAST_FORWARD = 'm733'         // 快进10秒
export const  BACKWARD = 'm755'             // 后退10秒
export const  NEXT_SONG = '766'             // 下一首
export const  PREVIOUS_SONG = '777'         // 上一首
//------------------ 3. 灯光 ------------------
export const  BACKLIGHT1 = 'bk000'          // 背光1
export const  BACKLIGHT2 = 'bk050'          // 背光2
export const  BACKLIGHT3 = 'bk100'          // 背光3

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
    id: 3,
    title: '连接wifi', 
    value: CONNECT_WIFI, 
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
    title: '暂停播放MP4', 
    value:  STOP_MP4,
  },  
  {
    id: 7,
    title: '继续播放MP4', 
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
  
//------------------ 3. 灯光 ------------------
  {
    id: 12,
    title: '背光1', 
    value:  BACKLIGHT1,
  },  
  {
    id: 13,
    title: '背光2', 
    value:  BACKLIGHT2,
  },  
  {
    id: 14,
    title: '背光3', 
    value:  BACKLIGHT3
  },  
]