import request from './request.js'


// 获取aliUserId（支付宝）
export function getAccessToken(data) {
	return request('/nbwaterApp/aliPay/getAccessToken', 'post', data).then(res => res)
}
// 获取aliUserId（支付宝）
export function getAppAuthToken(data) {
	return request('/nbwaterApp/aliPay/getAppAuthToken', 'get', data).then(res => res)
}



// 获取openid（微信）
export function getOpenid(data) {
	return request('/nbwaterApp/nbUser/getOpenId', 'post', data).then(res => res)
}
// 获取openid（微信）
export function getPhoneNumber(data) {
	return request('/bluetooth/device/business/getPhoneNumber', 'post', data).then(res => res)
}
// 微信获取openId 
export function wxGetOpenId(data) {
	return request('/ecm/api/app/student/user/getOpenId', 'post', data)
}
// app微信登录 
export function wxLogin(data) {
	return request('/ecm/api/app/student/user/wxLogin', 'post', data)
}
// 微信公众号获取getWebAccessToken 
export function getWebAccessToken(data) {
	return request('/ecm/api/app/student/user/getWebAccessToken', 'post', data)
}

// 登录（支付宝）
export function aliLogin(data) {
	return request('/nbwaterApp/nbUser/aliLogin', 'post', data).then(res => res)
}
// 登录（微信）
export function getInfo(data) {
	return request('/nbwaterApp/nbUser/getInfo', 'post', data).then(res => res)
}
// 登录
export function getBalanceByMobile(data) {
	return request('/bluetooth/device/business/getBalanceByMobile', 'post', data).then(res => res)
}
// 通过手机号绑定
export function binding(data) {
	return request('/nbwaterApp/nbUser/binding', 'post', data).then(res => res)
}
// 查询手机号是否绑定了IC卡
export function getProfile(data) {
	return request('/nbwaterApp/nbUser/getProfile', 'get', data).then(res => res)
}
// 发送手机验证码
export function sendRqCode(data) {
	return request('/nbwaterApp/nbUser/send', 'get', data).then(res => res)
}
// 获取学校列表
export function getSchoolList(data) {
	return request('/nbwaterApp/nbUser/getOrg', 'get', data).then(res => res)
}
// 通过IC卡号和密码绑定
export function bindingForCard(data) {
	return request('/nbwaterApp/nbUser/bindingForCard', 'post', data).then(res => res)
}




// 水泵机开闸
export function startDevice(data) {
	return request('/nbwaterApp/nbApp/start', 'post', data).then(res => res)
}
// 查询水泵机状态
export function getTatus(data) {
	return request('/nbwaterApp/nbApp/status', 'post', data).then(res => res)
}
// 查询水控机状态
export function getDeviceInfoByQrcode(data) {
	return request('/bluetooth/device/business/getDeviceInfoByQrcode', 'post', data).then(res => res)
}
// 消费上载【前端用/通过蓝牙】
export function uploadConsume(data) {
	return request('/bluetooth/device/business/uploadConsume', 'post', data).then(res => res)
}
// 开阀开始用水
export function startUseWater(data) {
	return request('/bluetooth/device/business/startUseWater', 'post', data).then(res => res)
}
// 关阀结束用水
export function endUsingWater(data) {
	return request('/bluetooth/device/business/endUseWater', 'post', data).then(res => res)
}
// 设备激活
export function activate(data) {
	return request('/bluetooth/device/business/activate', 'post', data).then(res => res)
}
// 设备重置
// export function resetDevice(data) {
// 	return request('/bluetooth/device/business/resetDevice', 'post', data).then(res => res)
// }
// 报修【提交】
export function repair(data) {
	return request('/bluetooth/device/business/repair', 'post', data).then(res => res)
}
// 报修【查询】
export function repairLog(data) {
	return request('/bluetooth/device/business/repairLog', 'post', data).then(res => res)
}
// 获取图片
export function queryImageById(data) {
	return request(`/bluetooth/device/business/queryImageById/${data}`, 'post', data).then(res => res)
}
// 水泵机关闸
export function stopDevice(data) {
	return request('/nbwaterApp/nbApp/stop', 'post', data).then(res => res)
}



// 4g创建订单
export function queryCreateOrder(data) {
	return request('/nbwaterApp/nbOder/createOrder', 'post', data).then(res => res)
}
// 蓝牙创建订单
export function createOrderByBluetooth(data) {
	return request('/nbwaterApp/nbOder/createOrderByBluetooth', 'post', data).then(res => res)
}
// 蓝牙开阀失败退款
export function bluetoothRefund(data) {
	return request('/nbwaterApp/nbOder/bluetoothRefund', 'post', data).then(res => res)
}
// 查询水泵机状态
export function wxOrder(data) {
	return request('/bluetooth/device/business/wxOrder', 'post', data).then(res => res)
}
// 查询订单（消费记录） --- 微信&&支付宝
export function queryOrderList(data) {
	return request('/nbwaterApp/nbOder/orderList', 'post', data).then(res => res)
}
// 查询订单（消费记录） --- 微信&&支付宝
export function queryConsumeDetail(data) {
	return request('/bluetooth/device/business/queryConsumeDetail', 'post', data).then(res => res)
}
// 查询订单 --- IC卡
export function queryConsumeStatus(data) {
	return request('/nbwaterApp/nbOder/queryConsumeStatus', 'post', data).then(res => res)
}
// 退款回调->更新订单->关闸
export function updateForBack(data) {
	return request('/nbwaterApp/nbOder/updateForBack', 'put', data).then(res => res)
}
// 支付回调->更新订单->开闸
export function updateForPay(data) {
	return request('/nbwaterApp/nbOder/updateForPay', 'put', data).then(res => res)
}
// 更新订单
export function updateOrder(data) {
	return request('/nbwaterApp/nbOder/updateOrder', 'put', data).then(res => res)
}
// IC卡消费
export function payForIcCard(data) {
	return request('/nbwaterApp/nbOder/ICPay', 'post', data).then(res => res)
}
// IC卡消费结束
export function ICPayEnd(data) {
	return request('/nbwaterApp/nbOder/ICPayEnd', 'post', data).then(res => res)
}
// 水控机消费记录 --- IC卡
export function queryNBConsumeLog(data) {
	return request('/nbwaterApp/nbOder/queryNBConsumeLog', 'post', data).then(res => res)
}
// IC卡余额
export function queryNBBalance(data) {
	return request('/nbwaterApp/nbOder/queryNBBalance', 'post', data).then(res => res)
}
