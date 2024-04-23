const BT_SND = {
	// 开发
	DEVICES_OPEN: {
		COMMAND: "BLE_O",
	},
	// 停水
	// DEVICES_STOP: {
	// 	COMMAND: "BLE_S",
	// },
	// 关阀
	DEVICES_CLOSE:{
		COMMAND: "BLE_C",
	},
	// 连接认证
	DEVIDES_AUTH: {
		COMMAND: "BLE_A"
	},
	// 初始化认证
	DEVIDES_INIT: {
		COMMAND: "BLE_I"
	},
	// 激活绑定
	DEVIDES_BIND: {
		COMMAND: "BLE_B"
	},
	// 激活绑定
	DEVIDES_RESET: {
		COMMAND: "BLE_R"
	},
	// 上载数据成功
	UPLOAD_SUCCESS: {
		COMMAND: "BLE_U_SUCCESS"
	},
	// 设置设备参数
	SET_PARAM: {
		COMMAND: "BLE_P_S"
	},
	// 设置设备参数
	SET_PARAM_ALL: {
		COMMAND: "BLE_P_S_ALL"
	},
	// 获取设备参数
	QUERY_PARAM: {
		COMMAND: "BLE_P_Q"
	},
	// 获取设备所有参数
	QUERY_PARAM_ALL: {
		COMMAND: "BLE_P_Q_ALL"
	},
	// 获取设备所有参数
	QUERY_ORDER_STATE: {
		COMMAND: "BLE_S"
	}
}

export default BT_SND