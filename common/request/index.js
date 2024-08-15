import request from './request.js'


// 意见反馈提交
export function tmcTempLog(data) {
	return request('/ecm/api/hotpump/tmcTempLog', 'post', data).then(res => res)
}



