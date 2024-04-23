<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getLocation({
				type: 'wgs84',
				success: function (res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
				},
				fail(err) {
					
					// uni.showModal({
					// 	title: "“智慧热水”需要获取您的地理位置",
					// 	content: "您的位置信息获取失败，我们需要您的位置信息来获取身边的热水设备信息，更好的为您提供服务；您可以在控制中心打开定位，打开安卓系统中设置-位置管理权限，选择微信，位置权限选择允许，并重启微信app，扫码使用热水"
					// })
					console.log("定位失败", err)
				}
			});
			await this.BLE.openBluetoothAdapter()
			this.$isResolve()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
