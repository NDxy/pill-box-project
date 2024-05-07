
function LOCATION(){
	return new Promise ((resolve, reject) => {
// 定位开启状态 true=开启，false=未开启
		let bool = false
		
		// android平台
		if (uni.getSystemInfoSync().platform == 'android') {
			let context = plus.android.importClass("android.content.Context");
			let locationManager = plus.android.importClass("android.location.LocationManager");
			let main = plus.android.runtimeMainActivity();
			let mainSvr = main.getSystemService(context.LOCATION_SERVICE);
			bool = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)
		}
		
		// ios平台
		if (uni.getSystemInfoSync().platform == 'ios') {
			let cllocationManger = plus.ios.import("CLLocationManager");
			let enable = cllocationManger.locationServicesEnabled();
			let status = cllocationManger.authorizationStatus();
			plus.ios.deleteObject(cllocationManger);
			bool = enable && status != 2
		}
		
		// 未开启定位功能
		if (bool === false) {
			uni.showModal({
				title: '提示',
				content: '请打开定位服务',
				success: ({
					confirm,
					cancel
				}) => {
					if (confirm) {
						// android平台
						if (uni.getSystemInfoSync().platform == 'android') {
							let Intent = plus.android.importClass('android.content.Intent');
							let Settings = plus.android.importClass('android.provider.Settings');
							let intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
							let main = plus.android.runtimeMainActivity();
							main.startActivity(intent); // 打开系统设置GPS服务页面
						}
						// ios平台
						if (uni.getSystemInfoSync().platform == 'ios') {
							let UIApplication = plus.ios.import("UIApplication");
							let application2 = UIApplication.sharedApplication();
							let NSURL2 = plus.ios.import("NSURL");
							let setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
							application2.openURL(setting2);
							plus.ios.deleteObject(setting2);
							plus.ios.deleteObject(NSURL2);
							plus.ios.deleteObject(application2);
						}
					}
					// 用户取消前往开启定位服务
					if (cancel) {
						// do sth...
						resolve(bool)
					}
				}
			});
		}else{
			resolve(bool)
		}
	})
}

export default LOCATION