import { requestURL } from '../utils/config.js'

function getType(data, method) { // 获取请求方式
	let type = {}
	if (method == 'post') {
		method = 'post'
		type = {
			method,
			data: {
				...data
			},
			header: {
				'content-type': 'application/json',
				'token': uni.getStorageSync('LOGIN_TOKEN')
			}
		}
	} else {
		// method = 'get'
		type = {
			method,
			data: {
				...data
			},
			header: {
				'content-type': 'application/json',
				'token': uni.getStorageSync('LOGIN_TOKEN')
			}
		}
	}
	return type
}
function request(url, method, data) {
	return new Promise((resolve, reject) => {
		//uni.showLoading()
		uni.request({
			url: requestURL + url,
			...getType(data, method),
			success: res => {
				if(res.statusCode == 200) {
					resolve(res.data)
				} else {
					if(res.statusCode == 502) {
						uni.showModal({
							title: '',
							content: '网络超时,请稍后打开!',
							showCancel:false
						})
					} if(res.statusCode == 500) {
						console.log('服务器错误,请稍后打开!')
						// uni.showModal({
						// 	title: '',
						// 	content: '服务器错误,请稍后打开!',
						// 	showCancel:false
						// })
					} else {
						uni.showModal({
							title: '',
							content: res.errMsg,
							showCancel:false
						})
					}
				}
			},
			fail: err => {
				// uni.hideLoading()
				console.log('err')
				reject(err)
			},
			complete:function(rrr){
				// console.log('rrr')
				// uni.hideLoading()
			}
		})
	}).catch(err => {
		console.log(err)
		uni.hideLoading()
		// reject(err)
	})
}

export default request