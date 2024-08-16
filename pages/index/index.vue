<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<image src="../../static/logo.png" mode="scaleToFill"></image>老友药记
			<!-- <uni-icons @click="toSetting" style="position: absolute; right: 32rpx; color: #fefefe;" type="gear-filled" size="28"></uni-icons> -->
		</view>
		<view class="pill_list">
			<view class="pill_item" v-for="item in devices" :key="item.deviceId">
				<view class="pill_item_box" @click="toDetails(item)">
					<view class="pill_img">
						<image src="../../static/yh.png" mode="scaleToFill"></image>
					</view>
					<view class="pill_name">{{item.deviceName}}</view>
					<view class="pill_NO">{{item.name}}</view>
				</view>
			</view>
			<view class="pill_item">
				<view class="pill_item_box add" @click="addDevices">
					+
					<view class="add_text">新增设备</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	export default {
		data() {
			return {
				statusbarHeight: 45,
				devices: []
			}
		},
		async onLoad() {
			this.statusbarHeight = uni.getStorageSync('SET_STATUS_BAR') * 2
			_this = this;
			await this.$onLaunched
			// this.adapterState = await this.BLE.getBluetoothAdapterState()
			// console.log(this.adapterState)
			// this.getDeviceList()
		},
		onShow() {
			this.devices = uni.getStorageSync('devices')
			console.log(this.devices)
		},
		methods: {
			async getDeviceList() {
				const adapterState = await this.BLE.getBluetoothAdapterState()
				if( adapterState.available ){
					if( adapterState.discovering ) { // && this.devices.length < 1
						const list = await this.BLE.getDeviceList()
						this.devices = list ? list : []
						console.log("devices: ", this.devices)
						return
					}
					uni.showToast({
						title: '获取设备...',
						icon: 'loading',
						duration: '99999',
						mask: true
					})
					this.BLE.startBluetoothDevicesDiscovery('YH', 'BLE')
					this.BLE.onGetBLEDevices((e)=>{
						// this.loading = false
						uni.hideToast()
						this.devices = e
					})
				}
			},
			toDetails(Device){
				uni.navigateTo({
					url: '../devicesDetails/index?device=' + JSON.stringify(Device)
				})
			},
			addDevices(){
				uni.navigateTo({
					url: '../addDevices/index'
				})
			},
			toSetting(){
				uni.navigateTo({
					url: '../setting/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		// align-items: center;
		// justify-content: center;
		line-height: 24px;
		width: 100vw;
		height: 100vh;
		overflow: auto;
		background-color: #f8f8f8;
		// background-image: linear-gradient(#7067ff, #4377fd 0%, #f1f5fc 40%);
		background-image: radial-gradient(circle at 50% -60%, #4377fd 50%, transparent 50.1%);
		
		// background-image: radial-gradient(circle at 50% 50%, #7eacc1 10%, transparent 20%), 
		// 				radial-gradient(circle at 30% 40%, #89c69d 10%, transparent 20%), 
		// 				radial-gradient(circle at 0% 8%, #d59d99 10%, transparent 40%),
		// 				radial-gradient(circle at 200rpx 800rpx, #4dddb2 100rpx, transparent 550rpx), 
		// 				radial-gradient(circle at 600rpx 300rpx, #88cdf6 300rpx, transparent 600rpx);
	}
	.pill_list{
		width: 100vw;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.pill_item{
		width: calc(100% / 2);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 24rpx;
		box-sizing: border-box;
	}
	.pill_item_box{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		position: relative;
		z-index: 1;
		padding: 24rpx;
		// background-color: #FFF;
		backdrop-filter: blur(15px);
		background-color: rgba(255, 255, 255, 0.4);
		border-radius: 24rpx;
		box-shadow: rgba(18, 135, 239, 0.3) 2rpx 2rpx 6rpx;
		width: 100%;
		height: 150rpx;
		&.add{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 100rpx;
			color: #999;
			.add_text{
				padding-top: 12rpx;
				font-size: 32rpx;
			}
		}
	}
	.pill_img{
		position: absolute;
		top: 0;
		right: 0;
		z-index: -1;
		opacity: 0.8;
		image{
			width: 240rpx;
			height: 180rpx;
		}
	}
	.pill_name{
		font-weight: 600;
		font-size: 36rpx;
	}
	.pill_NO{
		font-size: 30rpx;
		color: #666;
	}
	.header{
		display: flex;
		align-items: center;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 40rpx;
		font-weight: 900;
		color: #FFF;
		padding-left: 48rpx;
		image{
			width: 50rpx;
			height: 50rpx;
			margin-right: 16rpx;
		}
	}
</style>
