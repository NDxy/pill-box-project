<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			智慧药盒
		</view>
		<view class="pill_box">
			<view class=""></view>
			<mo-input icon="phone" type="text" :showClear="true" placeholder="请输入手机号码/账号名/邮箱" />
		</view>
		<view class="search_box">
			<view class="search_icon blud" @click="findPillBox">
				<text class="iconfont icon-lanya"></text>
				<text>寻找药盒</text>
			</view>
		</view>
		<mo-dialog type="input" ref="modelDialog" @confirm="dialogConfirm"/>
	</view>
</template>

<script>
	let _this;
	import moDialog from '../../components/mo-dialog/mo-dialog.vue';
	export default {
		components: {
			moDialog
		},
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
			// this.adapterState = await this.BLE.getBluetoothAdapterState()
			// this.getDeviceList()
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
			findPillBox(){
				this.$refs.modelDialog.showDialog()
			},
			dialogConfirm(e){
				console.log(e)
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
