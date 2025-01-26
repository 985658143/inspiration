export const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

// 判断是否是十六进制
export function isHexadecimal(input) {  
  // 去掉前导空格  
  input = input.trim();  

  // 正则表达式匹配：以0x或0X开头，后面跟随0-9或a-f或A-F字符  
  const hexPattern = /^(0x|0X)?[0-9a-fA-F]+$/;  

  // 测试输入是否符合正则表达式  
  return hexPattern.test(input);  
}  

export const strToUtf8Bytes = str => {
  let bytes = []
  for (let i = 0; i < str.length; ++i) {
      let code = str.charCodeAt(i)
      if (code >= 0x10000 && code <= 0x10ffff) {
          bytes.push((code >> 18) | 0xf0) 
          bytes.push(((code >> 12) & 0x3f) | 0x80)
          bytes.push(((code >> 6) & 0x3f) | 0x80)
          bytes.push((code & 0x3f) | 0x80)
      } else if (code >= 0x800 && code <= 0xffff) {
          bytes.push((code >> 12) | 0xe0)
          bytes.push(((code >> 6) & 0x3f) | 0x80)
          bytes.push((code & 0x3f) | 0x80)
      } else if (code >= 0x80 && code <= 0x7ff) {
          bytes.push((code >> 6) | 0xc0)
          bytes.push((code & 0x3f) | 0x80)
      } else {
          bytes.push(code)
      }
  }
  return bytes
}

export function stringToAscii(str, mtuSize) {
  // 将字符串转换为 ASCII 码的 ArrayBuffer
  const asciiCodes = []
  for (let i = 0; i < str.length; i++) {
    asciiCodes.push(str.charCodeAt(i))
  }
  
  const uint8Array = new Uint8Array(asciiCodes)
 
  // 定义一个 packets 数组，它将存储多个 Uint8Array 类型的元素
  const packets = []
  
  // 根据 MTU字节 大小拆分数据
  for (let i = 0; i < uint8Array.length; i += mtuSize) {
    packets.push(uint8Array.slice(i, i + mtuSize))
  }
 
  return packets
}

export function string2buffer(str) {//将字符串转为16进制
  let val = ""
  for (let i = 0; i < str.length; i++) {
      if (val === '') {
          val = str.charCodeAt(i).toString(16)
      } else {
          val += ',' + str.charCodeAt(i).toString(16)
      }
  }
  return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
  })).buffer;
}

// ArrayBuffer转16进度字符串示例
export function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return (`00${bit.toString(16)}`).slice(-2)
    }
  )
  return hexArr.join('')
}

export function multiSend(array, prefix, suffix, chunkSize = 14) {  

    // 结果数组  
    const resultArray = [];  

    // 拼接字符串  
    let combined = prefix + array;  

    // 判断拼接后的字符串长度  
    if (combined.length > 14) {  
        // 插入 0 到 14 的部分  
        resultArray.push(combined.slice(0, 18)); // 插入前14个字符  
        
        // 判断是否有超出部分  
        let excess = combined.slice(18);  
        console.log("multiSend----excess: ", excess);
        if(!excess) {
          resultArray.push(prefix+suffix);
        }
        let totalLength = combined.length;  

        // 处理超过18的部分按块进行拼接  
        let start = 14;  
        while (start < totalLength) {  
            // 获取下一块超出部分  
            let excessChunk = excess.slice(0, chunkSize);  
            if (excessChunk.length > 0) {  
                // 插入当前块加上后缀  
                if (start + chunkSize >= totalLength) {  
                    resultArray.push(prefix + excessChunk + suffix); // 最后一块加上后缀  
                } else {  
                    resultArray.push(prefix + excessChunk); // 普通插入  
                }  
            }  
            excess = excess.slice(chunkSize); // 更新超出部分  
            start += chunkSize; // 移动到下一个块  
        }  
    } else {  
        // 如果长度小于等于14，直接插入  
        resultArray.push(combined + suffix); // 直接插入并加上后缀  
    }  

    return resultArray;  
}  