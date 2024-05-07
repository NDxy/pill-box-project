const BT_YH = {
	// 连接认证
	DEVIDES_AUTH: {
		COMMAND: "YH_A_2685_END"
	},
	// 初始化认证
	DEVIDES_SET: {
		COMMAND: "YH_SET"
	},
	// 同步时间
	DEVIDES_TIME: {
		COMMAND: "YH_TIME"
	},
	// 删除药盒
	DEVIDES_CLR: {
		COMMAND: "YH_CLR"
	},
	// 闹铃上载
	UP_ALARM: {
		COMMAND: "YH_UP_ALARM_END"
	},
	// 用药记录
	HISTORY_TM: {
		S_COMMAND: "YH_TM_SUCCESS_END",
		F_COMMAND: "YH_TM_FAIL_END"
	},
	// 药盒搜寻打开
	DEVIDES_SEARCH_OPEN: {
		COMMAND: "YH_SEARCH_OPEN_END"
	},
	// 药盒搜寻关闭
	DEVIDES_SEARCH_CLOSE: {
		COMMAND: "YH_SEARCH_CLOSE_END"
	}
}

export default BT_YH