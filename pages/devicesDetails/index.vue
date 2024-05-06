<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<image src="../../static/water.png" mode="scaleToFill"></image>智慧药盒
		</view>
		<view class="pill_list">
			<view class="pill_item" v-for="item in devices" :key="item.NO">
				<view class="pill_item_box" @click="toDetails">
					<view class="pill_img">
						<img src="" alt="">
					</view>
					<view class="pill_name">{{item.deviceName}}</view>
					<view class="pill_NO">{{item.NO}}</view>
				</view>
			</view>
			<view class="pill_item">
				<view class="pill_item_box add" @click="addDevces">
					+
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
				devices: [{
					id: 1233,
					deviceName: '默认1',
					NO: 'YH-1233-BLE'
				},{
					id: 1233,
					deviceName: '默认2',
					NO: 'YH-1233-BLE'
				},{
					id: 1233,
					deviceName: '默认3',
					NO: 'YH-1233-BLE'
				}]
			}
		},
		async onLoad() {
			this.statusbarHeight = uni.getStorageSync('SET_STATUS_BAR') * 2
			_this = this;
			await this.$onLaunched
			this.adapterState = await this.BLE.getBluetoothAdapterState()
			this.getDeviceList()
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
		border-radius: 12rpx;
		box-shadow: #eee 2rpx 2rpx 6rpx;
		width: 100%;
		height: 180rpx;
		&.add{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 150rpx;
			color: #999;
		}
	}
	.pill_img{
		img{
			width: 120rpx;
			height: 90rpx;
		}
	}
	.pill_NO{
		font-size: 20rpx;
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
