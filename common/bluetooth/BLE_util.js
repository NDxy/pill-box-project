// uuid2Mac 统一安卓与IOS端deviceId展示
export function uuid2Mac(advertisData) {
  if (advertisData) {
    let bf = advertisData.slice(3, 9);
    let mac = Array.prototype.map
      .call(new Uint8Array(bf), (x) => ("00" + x.toString(16)).slice(-2))
      .join(":");
    mac = mac.toUpperCase();
    return mac;
  }
}

// 新设备去重
export function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// 将字符串转为 ArrayBuffer
export function str2ab(str) {
  let buf = new ArrayBuffer(str.length);
  let bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// ArrayBuffer转16进度字符串
export function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ("00" + bit.toString(16)).slice(-2);
  });
  return hexArr.join("");
}

// 将16进制转为 字符串
export function hexToString(str){
　　var val="",len = str.length/2;
　　for(var i = 0; i < len; i++){
　　　　val += String.fromCharCode(parseInt(str.substr(i*2,2),16));
　　}
	return val
	// return utf8to16(val);
}
//处理中文乱码问题
export function utf8to16(str) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while(i < len) {
 	c = str.charCodeAt(i++);
 	switch(c >> 4){ 
   		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	 		out += str.charAt(i-1);
	 	break;
   		case 12: case 13:
	 		char2 = str.charCodeAt(i++);
	 		out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	 	break;
   		case 14:
	 		char2 = str.charCodeAt(i++);
	 		char3 = str.charCodeAt(i++);
	 		out += String.fromCharCode(((c & 0x0F) << 12) |
			((char2 & 0x3F) << 6) |
			((char3 & 0x3F) << 0));
	 	break;
  	}
  }

	return out;
}
// 时间格式化
export function dateFtt(fmt, date) {
	var o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
		"W": date.getDay() == 0 ? 7 : date.getDay(), //日 
		"h+": date.getHours(), //小时 
		"m+": date.getMinutes(), //分 
		"s+": date.getSeconds(), //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		"S": date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
export function initTypes(code, errMsg) {
		switch (code) {
			case 10000:
				toast('未初始化蓝牙适配器');
				break;
			case 10001:
				toast('未检测到蓝牙，请打开蓝牙重试！');
				break;
			case 10002:
				toast('没有找到指定设备');
				break;
			case 10003:
				toast('连接失败');
				break;
			case 10004:
				toast('没有找到指定服务');
				break;
			case 10005:
				toast('没有找到指定特征值');
				break;
			case 10006:
				toast('当前连接已断开');
				break;
			case 10007:
				toast('当前特征值不支持此操作');
				break;
			case 10008:
				toast('其余所有系统上报的异常');
				break;
			case 10009:
				toast('Android 系统特有，系统版本低于 4.3 不支持 BLE');
				break;
			case 10010:
				toast('已连接');
				break;
			case 10011:
				toast('配对设备需要配对码');
				break
			case 10012:
				toast('连接超时');
				break;
			case 10013:
				toast('连接 deviceId 为空或者是格式不正确');
				break;
			default:
				toast(errMsg);
		}
	}
	
export function toast(content, showCancel = false) {
		uni.showModal({
			title: '提示',
			content,
			showCancel
		});
	}