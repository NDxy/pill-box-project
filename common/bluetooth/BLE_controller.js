/**
 * @author 宁显俊
 * @name 蓝牙通讯封装
 */

import {
  inArray,
  uuid2Mac,
  deviceNameFilter,
  hexToString,
  ab2hex,
  str2ab,
  initTypes,
  toast,
  dateFtt
} from "@/common/bluetooth/BLE_util.js";
import * as CryptoJS from '@/common/crypto-js/crypto-js';
import BT_YH from '@/common/bluetooth/command.js'

class BLEController {
	// 蓝牙适配器开启状态
	adapterOpend = null;
	// 新设备加载中
	static newDeviceLoad = false;
	// 连接设备中
	static deviceLinked = false;
	// 蓝牙设备ID，注意：ios设置对应deviceId为设备uuid，安卓及开发者工具上连接的蓝牙为mac地址
	static deviceId;
	static deviceName;
	// 设备mac地址（统一编码处理）
	static deviceMac;
	// 设备列表, [{deviceMac:设备mac地址， deviceId:设备ID,deviceName:设备名称，...}]
	deviceList = [];
	// 当前设备
	device = null;
	// 当前设备验证码
	deviceACode = null;
	// 当前设备的唯一码（激活设备时候使用）
	guid = null;
	// 蓝牙通信serviceId
	serviceId = "";
	// 临时数据
	static temporaryData = "";
	// 定时器变量
	static timer = null
	// 自定义监听事件
	static _events = {};
	
	constructor(context) {
		if (context) {
			// this.deviceId = context.deviceId;
			// this.deviceMac = context.deviceMac;
			this.newDeviceLoad = false;
			// this._events = [];
			// this.deviceList = [];
		}
	}
  
	/**
	 *  1.1初始化蓝牙模块
	 */
	static async openBluetoothAdapter(fn) {
		if (this.adapterOpend) {
		  console.log("蓝牙适配器已打开,请勿重复操作------》");
		  return {code: 0, status: true};
		}
		this.onBluetoothAdapterStateChange()
		return new Promise((resolve, reject) => {
			this.removeEvent('adapter')
			this.on('adapter', resolve)
			uni.openBluetoothAdapter({
				success: e => {
					this.adapterOpend = true;
					console.log('初始化蓝牙成功:' + e.errMsg);
					this.fire('adapter', {code: 0, status: true, ...e})
					
				},
				fail: e => {
					this.adapterOpend = false;
					console.log('初始化蓝牙失败，错误码：' + (e.errCode || e.errno));
					this.fire('adapter', {code: 305, status: false, ...e})
					// if (e.errCode !== 0) {
					// 	initTypes(e.errCode,e.errMsg);
					// }
				}
			});
		});
	}
	/**
	 *  1.2获取本机蓝牙适配器状态
	 */
	static async getBluetoothAdapterState(fn) {
		return new Promise((resolve, reject) => {
			uni.getBluetoothAdapterState({
				success(res) {
					resolve(res)
				},
				fail: e => {
					// reject(e)
					resolve(e)
					if (e.errCode !== 0) {
						initTypes(e.errCode,e.errMsg);
					}
				}
			})
		})
	}
	/**
	 *  1.3监听本机蓝牙适配器状态
	 */
	static async onBluetoothAdapterStateChange(fn) {
		let _this = this
		uni.onBluetoothAdapterStateChange(function (res) {
			console.log('adapterState changed, now is', res)
			_this.adapterOpend = res.available; 
			_this.fire('AdapterState', res)
		})
	}
	/**
	 * 2.1开始搜索蓝牙设备
	 * @param {String} startWord 搜索开始字符
	 * @param {String} endWord 搜索结束字符
	 */
	static startBluetoothDevicesDiscovery(startWord = '', endWord = '') {
		// this.closeBLEConnection()
		uni.startBluetoothDevicesDiscovery({
			success: e => {
				console.log('开始搜索蓝牙设备:' + e.errMsg);
				this.onBluetoothDeviceFound(startWord, endWord);
			},
			fail: e => {
				console.log('搜索蓝牙设备失败，错误码：' + e.errCode);
				if (e.errCode !== 0) {
					initTypes(e.errCode);
				}
			}
		});
	}
	/**
	 * 2.2监听蓝牙搜索
	 */
	static onBluetoothDeviceFound(startWord = '', endWord = '') {
		uni.onBluetoothDeviceFound(devices => {
			console.log('开始监听寻找到新设备的事件');
			this.getBluetoothDevices(startWord, endWord);
		});
	}
	/**
	 * 2.3获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
	 */
	static getBluetoothDevices(startWord = '', endWord = '') {
		let _this = this
		uni.getBluetoothDevices({
			success: res => {
				_this.newDeviceLoad = false;
				// console.log('获取蓝牙设备成功:', res);
				let list = res.devices
				// list = list.filter(i => i.name.indexOf(startWord) != -1);
				// if(endWord) list = list.filter(i => i.name.indexOf(endWord) != -1);
				
				list = list.filter(i => {
					let res = false
					let systemInfo = uni.getSystemInfoSync();
					// let iosDevice = systemInfo.system.toLowerCase().indexOf("ios") > -1;
					let iosDevice = systemInfo.osName.toLowerCase().indexOf("ios") > -1;
					let deviceMac = iosDevice
					  ? uuid2Mac(i.advertisData)
					  : i.deviceId;
					  i.deviceMac = deviceMac
					// console.log(i.name)
					if(i.name && i.name.indexOf(startWord) != -1){
						res = true
						if(endWord && i.name.indexOf(endWord) != -1){
							res = true
						}else if(endWord && i.name.indexOf(endWord) == -1){
							res = false
						}
					}else {
						res = false
					}
					return res
				})
				console.log('获取过滤后蓝牙设备成功:', list);
				_this.deviceList = list
				_this.fire('getbledevices', _this.deviceList)
			},
			fail: e => {
				console.log('获取蓝牙设备错误，错误码：' + e.errCode);
				if (e.errCode !== 0) {
					initTypes(e.errCode);
				}
			}
		});
	}
	/**
	 * 2.4直接获取蓝牙设备
	 */
	static async getDeviceList(){
		const adapterState = await this.getBluetoothAdapterState()
		if( adapterState.available ){
			return this.deviceList
		}else {
			return []
		}
	}
	/**
	 * 3.停止搜索蓝牙设备
	 */
	static stopBluetoothDevicesDiscovery(types) {
		// this.closeBLEConnection()
		return new Promise((resolve, reject) => {
			uni.stopBluetoothDevicesDiscovery({
				success: e => {
					resolve(e)
					console.log('停止搜索蓝牙设备:' + e.errMsg);
					this.deviceList = []
				},
				fail: e => {
					reject(e)
					console.log('停止搜索蓝牙设备失败，错误码：' + e.errCode);
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					}
				}
			});
		})
	}
	
	/**
	 * 4.1连接低功耗蓝牙
	 * @param {object} item 设备
	 */
	static createBLEConnection(item) {
		return new Promise(async (resolve, reject) => {
			let { deviceId, name } = item;
			console.log("链接信息：", this.deviceId, this.deviceName, deviceId, name)
			// 判断当前链接是否重复
			if(this.deviceId == deviceId){
				resolve({
					code: 0, msg: '当前设备已链接请勿重复链接', status: true,
					data: item,
				})
				return
			}
			const closeRes = this.deviceId ? await this.closeBLEConnection() : null
			this.deviceId = deviceId
			this.deviceName = name
			uni.showToast({
				mask: true,
				title: '连接蓝牙...',
				icon: 'loading',
				duration: 99999
			});
			this.removeEvent('connect')
			this.on('connect', resolve)
			uni.createBLEConnection({
				// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
				deviceId,
				success: res => {
					console.log('连接蓝牙成功:' + res.errMsg);
					// 获取设备服务
					this.getBLEDeviceServices(deviceId)
					// uni.showToast({
					// 	mask: true,
					// 	title: '连接认证...',
					// 	icon: 'loading',
					// 	duration: 99999
					// });
					// 设置超时
					// this.timeoutErr("认证", null, 10000, true)
					// 触发连接事件
					this.device = item
				},
				fail: e => {
					uni.hideToast()
					this.fire('connect', {code: 305, msg: '连接低功耗蓝牙失败，错误码：' + e.errMsg, status: false, ...item});
					console.log('连接低功耗蓝牙失败，错误码：' + e.errCode);
					this.deviceLinked = false
					this.deviceId = ""
					this.deviceName = null
					if (e.errCode !== 0) {
						initTypes(e.errCode);
					}
				}
			});
		})
	}
	/**
	 * 4.2获取蓝牙设备所有服务
	 */
	static getBLEDeviceServices(deviceId){
		
		setTimeout(() => {
			uni.getBLEDeviceServices({
			  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			  deviceId,
			  success: res => {
				console.log('device services:', res.services)
				let services = this.services = res.services.filter(i => i.isPrimary)
				// 获取所有特征值
				console.log('uuid',services[2].uuid)
				this.getBLEDeviceCharacteristics(deviceId, services[2].uuid)
			  }
			})
		}, 1000)
	}
	/**
	 * 4.3获取蓝牙设备某个服务中所有特征值
	 */
	static getBLEDeviceCharacteristics(deviceId, serviceId){
		uni.getBLEDeviceCharacteristics({
		  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
		  deviceId,
		  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
		  serviceId,
		  success: res => {
			console.log('device getBLEDeviceCharacteristics:', res.characteristics)
			let characteristics = null
			res.characteristics.forEach(i => {
				if(i.properties.write) {
					characteristics = i
					this.characteristics = i
				}
				// console.log('characteristics', i, characteristics, this.characteristics)
				
				// 该特征是否支持 notify ,indicate操作 ，开启监听订阅特征消息
				if (i.properties.notify || i.properties.indicate) {
					console.log('uuid',i.uuid)
					this.notifyBLECharacteristicValueChange(deviceId, serviceId, i.uuid)
				}
			})
			// 连接认证
			// this.getBLEauthentication()
			this.syncTime()
			this.fire('connect', {
				code: 0, msg: '链接成功！', status: true,
				data: this.device
			});
			
		  }
		})
	}
	/**
	 * 4.4 开启蓝牙监听订阅特征消息
	 */
	static notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId){
		uni.notifyBLECharacteristicValueChange({
		  state: true, // 启用 notify 功能
		  // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
		  deviceId,
		  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
		  serviceId,
		  // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
		  characteristicId,
		  success: res => {
				// console.log('notifyBLECharacteristicValueChange success', res.errMsg)
				this.onBLECharacteristicValueChange()
		  }
		})
	}
	/**
	 * 4.5 监听蓝牙数据
	 */
	static onBLECharacteristicValueChange(){
		uni.onBLECharacteristicValueChange(res => {
		  // console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
		  const DATA = hexToString(ab2hex(res.value))
		  // 整理数据
		  this.temporaryData += DATA
		  // console.log("接收部分数据：",this.temporaryData)
		  if(this.temporaryData.indexOf("_END") == -1){
			  return 
		  }
		  console.log("接收数据：",this.temporaryData)
		  this.changData(this.temporaryData)
		  if(this._events['receivemsg']) this.fire('receivemsg', this.temporaryData)
		})
	}
	/**
	 * 4.6 连接蓝牙设备的认证
	 */
	static getBLEauthentication(){
		
		this.sendMassage(BT_YH.DEVIDES_AUTH.COMMAND)
		
		// // 判断是否已激活
		// if(this.deviceName.indexOf('BLE') != -1){
		// 	// 设备链接前认证
		// 	let auth = parseInt(Math.random()* 9999) + ""
		// 	auth = auth.length < 4 ? pad(auth, 4) : auth
		// 	// console.log(encryptByDES(auth))
		// 	this.sendMassage(BT_YH.DEVIDES_AUTH.COMMAND)
		// }else {
		// 	// 设备激活前认证
		// 	const INCOMPLETEGUID = this.deviceName.split('-')[1]
		// 	this.sendMassage(BT_YH.DEVIDES_AUTH.COMMAND + "_" + INCOMPLETEGUID + "_END")
		// }
	} 
	/**
	 * 4.7 监听蓝牙连接状态
	 */
	static onBLEConnectionStateChange(){
		let _this = this
		uni.onBLEConnectionStateChange(function (res) {
			// 该方法回调中可以用于处理连接意外断开等异常情况
			// console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
			_this.fire('connectionState', {
				deviceId: res.deviceId,
				code: 0, 
				msg: res.connected ? '设备已离线' : '设备已连接', 
				status: res.connected,
				data: _this.deviceList.filter(i=> i.deviceId == res.deviceId)[0] //_this.device
			});
			// 如果是离线，则清除链接的数据
			// _this.closeBLEConnection()
			if(!res.connected){
				_this.deviceACode = null;
				_this.device = null;
				_this.deviceId = "";
				_this.deviceName = null;
				_this.deviceMac = null;
				_this.deviceLinked = false
			}
		})
	}
	/**
	 * 5.1 获取并整理数据
	 */
	static changData(data){
		let msg = "", code = 0, status = false, _this = this
		this.temporaryData = "";
		
		// 设备链接认证信息返回
		if(data.indexOf(BT_YH.DEVIDES_AUTH.D_COMMAND) != -1){
			if(data.indexOf(BT_YH.DEVIDES_AUTH.D_F_COMMAND) != -1){
				code = 500
				msg = "蓝牙设备认证错误, 请重新查询并连接"
				status = false
				_this.closeBLEConnection()
			}else {
				code = 0
				msg = "蓝牙设备连接并认证成功"
				status = true
				_this.deviceACode = data.split("_")[3]
				// 连接设备后断开搜索 并且不能搜索设备
				this.deviceLinked = true
				// TODO: 后续判断是否还需要停止搜索蓝牙设备
				// this.stopBluetoothDevicesDiscovery(true);
				clearTimeout(this.timer)
				// 监听蓝牙连接状态的改变事件
				this.onBLEConnectionStateChange()
				this.syncTime()
			}
			// 触发连接事件，并返回连接认证成功及当前连接的设备
			console.log('设备', _this.device)
			_this.fire('connect', {
				code, msg, status,
				data: _this.device
			});
		}
		
		// 蓝牙设置闹钟
		if(data.indexOf(BT_YH.DEVIDES_SET.D_COMMAND) != -1){
			clearTimeout(this.timer)
			if(data.indexOf(BT_YH.DEVIDES_SET.D_S_COMMAND) != -1){
				code = 0
				msg = "设置闹钟成功"
				status = true
			} else {
				code = 500
				msg = "设置闹钟失败, 请稍后重试"
				status = false
			}
			// 触发开阀事件
			this.fire('setAlarm', {
				code, msg, status,
				data: _this.device
			})
		}
		
		// 蓝牙关阀请求信息返回
		if(data.indexOf("BLE_D_C") != -1){
			clearTimeout(this.timer)
			if(data.indexOf("BLE_D_C_SUCCESS") != -1){
				code = 0
				msg = "热水关阀成功"
				status = true
				_this.closeBLEConnection()
			} else {
				code = 500
				msg = "热水关阀失败, 请稍后重试"
				status = false
			}
			// 触发关阀事件
			this.fire('closeWater', {
				code, msg, status
			})
		}
		
		// 认证连接蓝牙后进行的上载数据
		if(data.indexOf("BLE_D_U") != -1){
			let order
			try{
				let bleData = data.split('_')
				const bleCheckNum = bleData.splice(bleData.length-2, 1)[0]
				bleData.splice(bleData.length-1, 1)
				const myCheckNum = addHexFilm(bleData.join('_'))
				if ( bleCheckNum != myCheckNum ) throw '上载数据校验失败'
				order = {
					consumptionId: bleData[3], //订单号
					cardNo: bleData[4], //卡号
					cardBalance: bleData[5], //余额
					consumeAmount: bleData[6], // 订单消费金额
					consumeFlow: bleData[7], // 消费流量
					deviceRecordNo: bleData[8], // 设备流水号
					deviceTime: bleData[9] // 设备时间
				}
				code = 0
				msg = "上载数据获取成功"
				status = true
			}catch(e){
				code = 500
				msg = "上载数据获取失败：" + data + JSON.stringify(e)
				status = false
			}
			// 触发上载事件
			this.fire('upLoadData', {
				code, msg, status, order, data
			})
		}
		
		// 获取设备参数请求返回
		if(data.indexOf("BLE_D_P_Q_") != -1){
			let param = {}
			if(data.indexOf("_SUCCESS_END") != -1){
				// 去除参数外的字符串
				let dataStr = data.replace('BLE_D_P_Q_', '').replace('_SUCCESS_END', '');
				// 分割参数字符串
				let dataArr = dataStr.split('_');
				
				// 返回结果待校验的字符串
				let checkString = 'BLE_D_P_Q_' + dataStr.slice(0, dataStr.lastIndexOf('_'))
				// 本地需要校验的校验字段
				let checkNum = addHexFilm(checkString)
				// 的校验字段
				let resCheckNum = dataArr.splice(dataArr.length - 1, 1)[0]
				// console.log(checkString, checkNum, resCheckNum)
				
				if(checkNum != resCheckNum){
					code = 500
					msg = "校验获取参数失败, 请重新链接设备后重试"
					status = false
				}else {
					// 整理格式化数据
					for (let i = 0; i < dataArr.length; i++) {
						if(i%2 === 0){
							param[dataArr[i]] = dataArr[i + 1]
						}
					}
					console.log('处理好的参数：',param)
				}
				
			} else {
				code = 500
				msg = "参数获取失败, 请稍后重试"
				status = false
			}
			// 触发查询参数事件
			this.fire('queryParam', {
				code, msg, status, param
			})
		}
		
		// 批量设置设备参数请求返回
		if(data.indexOf("BLE_D_P_S_ALL_") != -1){
			if(data.indexOf("_SUCCESS_END") != -1){
				code = 0
				msg = "设置参数成功"
				status = true
			} else {
				code = 500
				msg ="设置失败, 请稍后重试"
				status = false
			}
			// 触发设置参数事件
			this.fire('setAllParam', {
				code, msg, status
			})
		}
		
		// 设置设备参数请求返回
		if(data.indexOf("BLE_D_P_S_") != -1){
			let key = data.split("_")[4]
			if(data.indexOf("_SUCCESS_END") != -1){
				code = 0
				msg = key + "设置参数成功"
				status = true
			} else {
				code = 500
				msg = key + "设置失败, 请稍后重试"
				status = false
			}
			// 触发设置参数事件
			this.fire('setParam', {
				code, msg, status, key
			})
		}
		
		// 通过订单获取当前订单设备的状态信息
		if(data.indexOf("BLE_D_S_") != -1){
			if(data.indexOf("_RUN_END") != -1){
				code = 0
				msg = "订单交易消费中"
				status = true
			} else if(data.indexOf("_OVER_END") != -1){
				code = 200
				msg = "订单已结束"
				status = false
			} else if(data.indexOf("_NULL_END") != -1){
				code = 404
				msg = "订单不存在(最近10条记录不存在该订单)"
				status = false
			} else {
				code = 500
				msg = "设置失败, 请稍后重试"
				status = false
			}
			// 触发设置参数事件
			this.fire('queryOrder', {
				code, msg, status
			})
		}
	}
	/**
	 * 5.2 发送低功率蓝牙信息
	 * @param {Object} COMMAND // 指令内容
	 */
	static sendMassage(command){
		console.log("发送蓝牙总指令", command)
		// console.log(this.services, this.deviceId, this.characteristics)
		let byteLen = command.length;
		let pos = 0;
		let loopCount = 0;
		// 数据分包
		let sending = i => {
			// let command = param.slice(i, i+20)
			let buffer = str2ab(command.slice(i, i+20));
			// console.log("发送的蓝牙分包指令", command.slice(i, i+20))
			setTimeout(() => {
				console.log("发送蓝牙指令", command)
				uni.writeBLECharacteristicValue({
				  // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
				  deviceId: this.deviceId,
				  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
				  serviceId: this.services[2].uuid,
				  // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
				  characteristicId: this.characteristics.uuid,
				  // 这里的value是ArrayBuffer类型
				  value: buffer,
				  success: res => {
					console.log('writeBLECharacteristicValue success', res.errMsg)
				  },
				  fail(err) {
				  	// console.log(err)
				  }
				})
				if(i < command.length){
					i += 20;
					sending(i);
				}
			}, 50) 
		}
		sending(0)
		
	}
	/**
	 * 关闭蓝牙连接
	 */
	static closeBLEConnection(fn){
		return new Promise((resolve, reject) => {
			if (fn) this.onCloseConnect(fn)
			uni.closeBLEConnection({
				deviceId: this.deviceId,
				success: (res) => {
					this.deviceACode = null;
					this.device = null;
					this.deviceId = "";
					this.deviceName = null;
					this.deviceMac = null;
					this.deviceLinked = false
					if (fn) this.fire('closeConnect', res);
					resolve(res)
				},
				fail: (err) => {
					if (fn) this.fire('closeConnect', err);
					reject(err)
				}
			})
		})
	}
	/**
	 * 7.1 时间同步
	 */
	static syncTime(){
		this.removeEvent('syncTime')
		return new Promise((resolve, reject) => {
			const checkNum = addHexFilm(BT_YH.DEVIDES_TIME.COMMAND + "_" + dateFtt('yyyyMMddWhhmmss', new Date()))
			this.sendMassage(BT_YH.DEVIDES_TIME.COMMAND + "_" + dateFtt('yyyyMMddWhhmmss', new Date()) + "_" + checkNum + "_END")
			this.on('syncTime', resolve)
		});
	}
	/**
	 * 7.2 设置闹钟
	 * @param {object} param 闹钟的参数
	 */
	static setAlarm(param){
		let {alarmId, time, playTypeBit, videoId} = param
		this.removeEvent('setAlarm')
		return new Promise((resolve, reject) => {
			const checkNum = addHexFilm(BT_YH.DEVIDES_SET.COMMAND + "_" + alarmId + "_" + time.replace(':', '') + "_" + playTypeBit + "_" + videoId)
			this.sendMassage(BT_YH.DEVIDES_SET.COMMAND + "_" + alarmId + "_" + time.replace(':', '') + "_" + playTypeBit + "_" + videoId + "_" + checkNum + "_END")
			this.on('setAlarm', resolve)
		});
	}
	/**
	 * 7.3 手机请求设备上载设置
	 */
	static syncAlarm(){
		this.removeEvent('syncAlarm')
		return new Promise((resolve, reject) => {
			this.sendMassage(BT_YH.UP_ALARM.COMMAND)
			this.on('syncAlarm', resolve)
		});
	}
	/**
	 * 7.4 手机请求删除闹钟
	 * @param {String, Number} ID 闹钟ID
	 */
	static deleteAlaem(ID){
		this.removeEvent('delete')
		return new Promise((resolve, reject) => {
			this.sendMassage(BT_YH.DEVIDES_CLR.COMMAND + "_" + ID + "_END")
			this.on('delete', resolve)
		});
	}
	/**
	 * 7.5 手机寻找设备终端: 开
	 */
	static searchDeviceOpen(){
		this.removeEvent('searchDeviceO')
		return new Promise((resolve, reject) => {
			this.sendMassage(BT_YH.DEVIDES_SEARCH_OPEN.COMMAND)
			this.on('searchDeviceO', resolve)
		});
	}
	/**
	 * 7.6 手机寻找设备终端: 关
	 */
	static searchDeviceClose(){
		this.removeEvent('searchDeviceC')
		return new Promise((resolve, reject) => {
			this.sendMassage(BT_YH.DEVIDES_SEARCH_CLOSE.COMMAND)
			this.on('searchDeviceC', resolve)
		});
	}
	// *******************************添加事件*******************************
	
	/**
	 * 监听蓝牙适配器状态变化事件
	 */
	static onAdapterState(fn) {
		this.removeEvent('AdapterState')
		this.on('AdapterState', fn)
	}
	/**
	 * 监听连接设备事件
	 */
	static onConnect(fn) {
		this.removeEvent('connect')
		this.on('connect', fn)
	}
	/**
	 * 监听连接情况
	 */
	static onConnectionState(fn) {
		this.removeEvent('connectionState')
		this.on('connectionState', fn)
	}
	/**
	 * 监听连接设备事件
	 */
	static onCloseConnect(fn) {
		this.on('closeConnect', fn)
	}
	/**
	 * 监听获取设备事件
	 */
	static onGetBLEDevices(fn) {
		this.removeEvent('getbledevices')
		this.on('getbledevices', fn)
	}
	/**
	 * 监听获取设备接收的数据
	 */
	static onReceiveMsg(fn) {
		this.on('receivemsg', fn)
	}
	
	/**
	 * 监听获取设备接收的数据
	 */
	static onUpLoadData(fn) {
		this.removeEvent('upLoadData')
		this.on('upLoadData', fn)
	}
	
	/**
	 * 监听事件添加
	 * @param {Function} fn 监听触发事件
	 * @param {String} type 事件类型
	 */
	static on(type, fn) {
		type = type.toLowerCase();
		if (typeof fn != 'function') {
			console && console.error && console.error('the second argument fn is requird as function');
			return this;
		}
		if (!this._events[type]) {
			this._events[type] = [];
		}
		this._events[type].push(fn)
	}
	
	/**
	 * 事件触发
	 * @param {String} type 事件类型
	 * @param {String} data 监听处理数据
	 */
	static fire(type, data) {
		type = type.toLowerCase();
		if(this._events[type])
		this._events[type].forEach(h => h(data))
	}
	/**
	 * 事件移除
	 */
	static removeEvent(type) {
		type = type.toLowerCase();
		delete this._events[type]
	}
	/**
	 * 超时任务
	 * @param {String} msg
	 */
	static timeoutErr(msg, fn, time, clear = false){
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			uni.hideToast()
			if(this.deviceLinked) this.closeBLEConnection()
			if(clear){
				this.closeBLEConnection()
			}
			if(typeof fn == 'function'){
				fn()
			}else {
				toast(`设备${msg}超时，请重新蓝牙连接此设备后再执行此操作`)
			}
		}, time)
	}
}

// 3des加密、
function encryptByDES(message) {
    let keyHex = CryptoJS.enc.Utf8.parse('1q2w3e4r5t6y7u8i');
    let encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
      // iv: CryptoJS.enc.Utf8.parse('7254567-'),  // 好像没用
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.ciphertext.toString();
}
// 字符串补零
function pad(num, n) {
  let len = num.length;
  while(len < n) {
	num = "0" + num;
	len++;
  }
  return num;
}

// 转16进制
function stringToHex(str){
　　let val="";
　　for(let i = 0; i < str.length; i++){
　　　　if(val == "")
　　　　　　val = str.charCodeAt(i).toString(16);
　　　　else
　　　　　　val += "," + str.charCodeAt(i).toString(16);
　　}
　　return val;
}
// 蓝牙通讯校验
function addHexFilm(str){
	let strArr = stringToHex(str).split(',')
	let addHex = 0
	for (let i = 0; i < strArr.length; i++) {
		addHex += parseInt(strArr[i], 16)
	}
	return addHex % 256
}

export default BLEController