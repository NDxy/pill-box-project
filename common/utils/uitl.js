export function isUndef(v) {
	return v === undefined || v === null
}

export function isDef(v) {
	return v !== undefined && v !== null
}

export function isTrue(v) {
	return v === true
}

export function isNull(v) {
	return v === "" || v === null
}


export function isFalse(v) {
	return v === false
}

// 获取当前月份的天数
export function mGetDate(year, mouth) {
	var date = new Date();
	var year = year ? year : date.getFullYear();
	var month = mouth ? mouth : date.getMonth() + 1;
	var d = new Date(year, month, 0);
	return d.getDate();
}

// 解析目前使用的二维码的格式
export function getQueryString(url, name) {
	var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
	var r = url.substr(1).match(reg);
	if (r != null) {
		return r[2];
	}
	return null;
}

// 时间格式化
export function dateFtt(fmt, date) {
	var o = {
		"M+": date.getMonth() + 1, //月份 
		"d+": date.getDate(), //日 
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
// 手机号码验证
export function chkPhone(phone) {
	if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
		return true;
	} else {
		return false
	}
}

// 时间格式化（转‘-’为‘/’）用于兼容IOS
export function strToDate(dateObj) {
	dateObj = dateObj.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
	return new Date(dateObj)
}

export function toast(content, showCancel = false) {
		uni.showModal({
			title: '提示',
			content,
			showCancel
		});
	}