<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<image src="../../static/logo.png" mode="scaleToFill"></image>智慧药盒
			<uni-icons @click="toSetting" style="position: absolute; right: 32rpx; color: #fefefe;" type="gear-filled" size="28"></uni-icons>
		</view>
		<view class="pill_list">
			<view class="pill_item" v-for="item in devices" :key="item.deviceId">
				<view class="pill_item_box" @click="toDetails(item)">
					<view class="pill_img"> 
						<image src="../../static/logo.png" mode="scaleToFill"></image>
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
		background-image: linear-gradient(#7067ff, #4377fd 10%, #f1f5fc 82%);
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
		padding: 24rpx;
		background-color: #FFF;
		border-radius: 24rpx;
		box-shadow: rgba(18, 135, 239, 0.3) 2rpx 2rpx 6rpx;
		width: 100%;
		height: 190rpx;
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
		image{
			width: 120rpx;
			height: 90rpx;
		}
	}
	.pill_name{
		font-weight: 600;
	}
	.pill_NO{
		font-size: 26rpx;
		color: #999;
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
