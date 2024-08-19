<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<uni-icons @click="back" style="color: #fefefe;" type="left" size="24"></uni-icons> <text style="flex: 1;text-align: center;">查询设备</text><text></text>
		</view>
		<view class="search_box">
			<view class="search_icon blud" @click="refresh">
				<text class="iconfont icon-lanya"></text>
				<text>刷新列表</text>
			</view>
		</view>
		<view class="ble_list_box">
			<view class="list_title">
				扫描到的蓝牙设备
			</view>
			<view class="new_ble_list">
				<view class="ble_item" v-for="ble in devices" :key="ble.deviceId">
					<view class="msg_info">
						<view class="ble_name">{{ble.name}}</view>
						<view class="ble_ID">{{ble.deviceId}}</view>
					</view>
					<view class="connection" @click="connection(ble)">点击链接</view>
				</view>
			</view>
		</view>
		<mo-dialog type="input" ref="modelDialog" title="请输入名称" input-placeholder="请输入设备名称" :inputValue="dialogValue" @confirm="dialogConfirm"/>
		<!-- <view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			智慧药盒
		</view>
		<view class="setting">
			<button @click="setBluebooth">设置蓝牙</button>
			<button>设置定位</button>
		</view> -->
	</view>
</template>

<script>
	import LOCATION from '../../common/location/location';
	let _this;
	export default {
		data() {
			return {
				statusbarHeight: 45,
				devices: [],
				locationState: false,
				device: null,
				dialogValue: "智慧药盒"
			}
		},
		async onLoad() {
			this.statusbarHeight = uni.getStorageSync('SET_STATUS_BAR') * 2
			_this = this;
		},
		onShow() {
			setTimeout(() => {
				this.authorizeLandB()
			},100)
		},
		methods: {
			async refresh(){
				// this.list = await this.BLE.getDeviceList()
				// return this.list
				this.getDeviceList()
			},
			// 查询蓝牙设备
			async getDeviceList() {
				const adapterState = await this.BLE.getBluetoothAdapterState()
				if( adapterState.available ){
					if( adapterState.discovering ) { // && this.devices.length < 1
						const list = await this.BLE.getDeviceList()
						this.devices = list ? list : []
						console.log("devices: ", this.devices)
						console.log("available: ", adapterState.available)
						console.log("discovering: ", adapterState.discovering)
						return
					}
					uni.showToast({
						title: '获取设备...',
						icon: 'loading',
						duration: '99999',
						mask: true
					})
					// this.BLE.startBluetoothDevicesDiscovery('YH', 'BLE')
					this.BLE.startBluetoothDevicesDiscovery()
					this.BLE.onGetBLEDevices((e)=>{
						// this.loading = false
						uni.hideToast()
						this.devices = e
						// console.log(e)
					})
				}
			},
			// 打开蓝牙
			setBluebooth(){
				// var main = plus.android.runtimeMainActivity();
				// var Intent = plus.android.importClass('android.content.Intent');
				// var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
				// main.startActivity(mIntent);
				const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter');
				const blueadapter = BluetoothAdapter.getDefaultAdapter();
				if (blueadapter != null) {
					blueadapter.enable();
					setTimeout(() => {
						uni.redirectTo({
							url: '../addDevices/index'
						})
					}, 1000)
				}
				
			},
			//  授权打开蓝牙和定位
			async authorizeLandB(){
				const locationState = this.locationState = await LOCATION()
				// console.log('locationState', locationState)
				if(locationState){
					this.BLE.onAdapterState(state => {
						console.log('state', state)
						//TODO: 查询到状态后重新加载数据
					})
					const adapterRes = await this.BLE.openBluetoothAdapter()
					if(adapterRes.code == 0){
						// this.BLE.onAdapterState(state => {
						// 	console.log('state', state)
						// })
						this.adapterState = await this.BLE.getBluetoothAdapterState()
						this.getDeviceList()
					}else {
						uni.showModal({
							title: '提示',
							content: '蓝牙尚未打开，请打开蓝牙！',
							success: ({confirm, cancel}) => {
								if(confirm){
									this.setBluebooth()
								}
								if(cancel){
									
								}
							}
						});
					}
				}
			},
			// 链接蓝牙设备
			async connection(item){
				const e = await this.BLE.createBLEConnection(item)
				if(e.code == 0){
					this.device = item
					const devices = uni.getStorageSync('devices') || []
					console.log('devices', devices)
					const devicesfilter = devices.filter(i => i.deviceId === this.device.deviceId)
					if(devicesfilter.length === 0){
						this.dialogValue = item.name
						this.$refs.modelDialog.showDialog()
					}else {
						this.toDetails({...devicesfilter[0], deviceName: e.inputValue})
					}
				}else {
					uni.showModal({
						title: '提示',
						content: e.msg,
						showCancel: false
					});
				}
			},
			dialogConfirm(e){
				const devices = uni.getStorageSync('devices') || []
				const device = {...this.device, deviceName: e.inputValue}
				devices.push(device)
				uni.setStorageSync('devices', devices)
				this.toDetails(device)
			},
			toDetails(device){
				uni.navigateTo({
					url: '/pages/devicesDetails/index?device=' + JSON.stringify(device)
				})
			},
			back(){
				uni.navigateBack()
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
	
	.ble_list_box{
		width: 100%;
		height: calc(100vh - 376rpx);
		border-top-right-radius: 60rpx;
		border-top-left-radius: 60rpx;
		background-color: #FFF;
		padding: 32rpx;
		padding-top: 120rpx;
		box-sizing: border-box;
		position: relative;
	}
	
	.list_title{
		// background-color: #FFF;
		position: absolute;
		top: 0;
		padding: 0 32rpx;
		font-size: 36rpx;
		height: 120rpx;
		line-height: 120rpx;
		font-weight: 600;
	}
	
	.ble_item{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 0;
		border-bottom: 1rpx double #eee;
		box-sizing: border-box;
	}
	.ble_name{
		font-weight: 600;
	}
	.ble_ID{
		font-size: 28rpx;
		color: #999;
	}
	.connection{
		font-size: 28rpx;
		color: #79c6f9;
	}
	.header{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 40rpx;
		font-weight: 900;
		color: #FFF;
		padding-left: 12rpx;
		image{
			width: 50rpx;
			height: 50rpx;
			margin-right: 16rpx;
		}
	}
	
	
.search_box{
	width: 100%;
	height: 376rpx;
	margin-bottom: 24rpx;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	.search_icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 220rpx;
		height: 220rpx;
		border-radius: 50%;
		font-size: 32rpx;
		.iconfont::before{
			font-size: 80rpx;
		}
		&.blud {
			border: 14rpx solid #c3e4ff;
			background: linear-gradient(-45deg, #007AFF, rgba(0, 122, 255, 0.5));
			color: #c3e4ff;
		}
		&.indigo {
			border: 14rpx solid #cdf9ff;
			background: linear-gradient(-45deg, #0dc8e3, rgba(13, 200, 227, 0.5));
			color: #cdf9ff;
		}
		&.violet {
			border: 14rpx solid #f5dffe;
			background: linear-gradient(-45deg, #b94efc, rgba(185, 78, 252, 0.5));
			color: #f5dffe;
		}
		&.loading{
			animation: load 2s linear 0s infinite;
		}
	}
}
</style>
