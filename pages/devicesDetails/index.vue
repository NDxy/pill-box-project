<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<uni-icons @click="back" style="color: #fefefe;" type="left" size="24"></uni-icons>
			{{device.deviceName}}
		</view>
		<view class="pill_box">
			<view class="pill_box_image">
				<image src="../../static/logo.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="search_box">
			<view class="search_icon blud" @click="findPillBox">
				<uni-icons style="color: #c3e4ff;" type="notification-filled" size="32"></uni-icons>
				<text>寻找药盒</text>
			</view>
			<view class="search_icon violet" @click="tolink">
				<uni-icons style="color: #f5dffe;" type="link" size="32"></uni-icons>
				<text>链接药盒</text>
			</view>
			<view class="search_icon blud" @click="toHistory">
				<uni-icons style="color: #c3e4ff;" type="list" size="32"></uni-icons>
				<text>用药记录</text>
			</view>
		</view>
		<view class="search_box">
			<view class="search_icon blud" @click="toFeedback">
				<uni-icons style="color: #c3e4ff;" type="email-filled" size="32"></uni-icons>
				<text>意见反馈</text>
			</view>
			<view class="search_icon violet" @click="$refs.modelDialog.showDialog()">
				<uni-icons style="color: #f5dffe;" type="phone-filled" size="32"></uni-icons>
				<text>联系我们</text>
			</view>
			<view class="search_icon violet" @click="toAlarmSetting">
				<uni-icons style="color: #f5dffe;" type="gear-filled" size="32"></uni-icons>
				<text>设置</text>
			</view>
		</view>
		<!-- <view class="search_box">
		</view> -->
		<view class="search_box">
			<view class="search_icon blud" @click="toVideoList">
				<uni-icons style="color: #c3e4ff;" type="videocam-filled" size="32"></uni-icons>
				<text>视频播放</text>
			</view>
			<view class="search_icon violet" @click="$refs.setVolume.showDialog()">
				<uni-icons style="color: #f5dffe;" type="sound-filled" size="32"></uni-icons>
				<text>音量调节</text>
			</view>
		</view>
		<!-- <view class="tabbar_box">
			<view class="tabbar_item" @click="toHistory">
				<uni-icons style="color: #666;" type="list" size="32"></uni-icons>
				<text>记录</text>
			</view>
			<view class="tabbar_item" @click="toAlarmSetting">
				<uni-icons style="color: #666;" type="gear" size="32"></uni-icons>
				<text>设置</text>
			</view>
		</view> -->
		<mo-dialog ref="modelDialog" @confirm="contactUs" confirmText="拨打电话">
			<view class="contactUs">
				老年病学科：<text style="color: #73c8ff;">0771-3215588</text>
			</view>
		</mo-dialog>
		<mo-dialog ref="setVolume" @confirm="saveVolume" confirmText="拨打电话">
			<view class="contactUs">
				<!-- TODO:设置内容 -->
			</view>
		</mo-dialog>
	</view>
</template>

<script>
	import LOCATION from '../../common/location/location';
	let _this;
	export default {
		// components: {
		// 	moDialog
		// },
		data() {
			return {
				statusbarHeight: 45,
				device: {
					deviceName: '默认药盒',
				},
				volume: 20,
			}
		},
		async onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			console.log(options.device)
			this.statusbarHeight = uni.getStorageSync('SET_STATUS_BAR') * 2
			// this.tolink()
		},
		onShow() {
			setTimeout(() => {
				this.authorizeLandB()
			},100)
		},
		methods: {
			// 打开蓝牙
			setBluebooth(){
				// var main = plus.android.runtimeMainActivity();
				// var Intent = plus.android.importClass('android.content.Intent');
				// var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
				// main.startActivity(mIntent);
				const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter');
				const blueadapter = BluetoothAdapter.getDefaultAdapter();
				if (blueadapter != null) {
					return blueadapter.enable();
				}
				
			},
			//  授权打开蓝牙和定位
			async authorizeLandB(){
				const locationState = this.locationState = await LOCATION()
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
						this.tolink()
						this.adapterState = await this.BLE.getBluetoothAdapterState()
						// this.getDeviceList()
					}else {
						uni.showModal({
							title: '提示',
							content: '蓝牙尚未打开，请打开蓝牙！',
							success: ({confirm, cancel}) => {
								if(confirm){
									this.setBluebooth()
								}
								// if(cancel){
									
								// }
							}
						});
					}
				}
			},
			findPillBox(){
				if(this.finding){
					this.finding = false
					this.BLE.searchDeviceClose()
				}else {
					this.finding = true
					this.BLE.searchDeviceOpen()
				}
			},
			async tolink(){
				const connectionDev =  await this.BLE.createBLEConnection(this.device)
			},
			contactUs(e){
				uni.makePhoneCall({phoneNumber: '0771-3215588'})
			},
			saveVolume(){
				this.BLE.setVolume(this.volume)
					if(adapterRes.code == 0){
						uni.showToast({
							title: '设置成功！',
						});
					}else {
						uni.showToast({
							title: '设置失败！请重新蓝牙链接设备后重试',
						});
					}
			},
			back(){
				uni.navigateBack()
			},
			toFeedback(){
				uni.navigateTo({
					url: '../feedback/index?device=' + JSON.stringify(this.device)
				})
			},
			toHistory(){
				uni.navigateTo({
					url: '../history/index?device=' + JSON.stringify(this.device)
				})
			},
			toAlarmSetting(){
				uni.navigateTo({
					url: '../alarmSetting/index?device=' + JSON.stringify(this.device)
				})
			},
			toVideoList(){
				uni.navigateTo({
					url: '../playVideo/videoList?device=' + JSON.stringify(this.device)
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
	.header{
		display: flex;
		align-items: center;
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
		.header_rBtn{
			display: flex;
			align-items: center;
			position: absolute;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			font-weight: 600;
			right: 32rpx;
			color: #fefefe;
		}
	}
	.pill_box{
		display: flex;
		align-items: center;
		justify-content: center;
		.pill_box_image{
			width: 400rpx;
			height: 300rpx;
			image{
				width: 400rpx;
				height: 300rpx;
			}
		}
	}
.search_box{
	width: 100%;
	height: 280rpx;
	margin-bottom: 24rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	.search_icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		font-size: 30rpx;
		line-height: 60rpx;
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

.tabbar_box{
	position: absolute;
	bottom: 0;
	height: 130rpx;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #FFF;
	.tabbar_item{
		height: 130rpx;
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #666;
	}
}
</style>
