<template>
	<view class="content">
		<!-- <view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<uni-icons @click="back" style="color: #fefefe;" type="left" size="24"></uni-icons>
			{{device.deviceName}}
		</view> -->
		<view class="pill_box">
			<view class="pill_box_msg">
				<view class="pill_box_name">{{device.deviceName}}</view>
				<!-- <view class="pill_box_state">{{device.deviceName}}</view> -->
				<view class="pill_box_blename">蓝牙名称：{{device.name}}</view>
				<view class="pill_box_blename">版本号：{{device.version}}</view>
			</view>
			<view class="pill_box_image">
				<image src="../../static/yh.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="search_box">
			<view class="search_icon blud" @click="findPillBox">
				<uni-icons style="color: #c3e4ff;" type="notification-filled" size="28"></uni-icons>
				<text>寻找药盒</text>
			</view>
			<view class="search_icon indigo" @click="tolink">
				<uni-icons style="color: #cdf9ff;" type="link" size="28"></uni-icons>
				<text>链接药盒</text>
			</view>
		</view>
		<view class="menu_box">
			<view class="menu_groud">
				<view class="menu_item" @click="toHistory">
					<view class="menu_btn">
						<text>用药记录</text>
						<view class="icon_box blud">
							<view class="icon_mask"><uni-icons :style="iconStyle" type="list" size="36"></uni-icons></view>
						</view>
					</view>
				</view>
				<view class="menu_item" @click="toAlarmSetting">
					<view class="menu_btn">
						<text>提醒设置</text>
						<view class="icon_box violet">
							<view class="icon_mask"><uni-icons :style="iconStyle" type="gear-filled" size="36"></uni-icons></view>
						</view>
					</view>
				</view>
				<view class="menu_item" @click="$refs.setVolume.showDialog()">
					<view class="menu_btn">
						<text>音量调节</text>
						<view class="icon_box indigo">
							<view class="icon_mask"><uni-icons :style="iconStyle" type="sound-filled" size="36"></uni-icons></view>
						</view>
					</view>
				</view>
				<view class="menu_item" @click="toVideoList">
					<view class="menu_btn">
						<text>视频播放</text>
						<view class="icon_box info">
							<view class="icon_mask"><uni-icons :style="iconStyle" type="videocam-filled" size="36"></uni-icons></view>
						</view>
					</view>
				</view>
				<view class="menu_item" @click="toFeedback">
					<view class="menu_btn">
						<text>意见反馈</text>
						<view class="icon_box blud">
							<view class="icon_mask"><uni-icons :style="iconStyle" type="email-filled" size="36"></uni-icons></view>
						</view>
					</view>
				</view>
				<view class="menu_item" @click="$refs.modelDialog.showDialog()">
					<view class="menu_btn">
						<text>联系我们</text>
						<view class="icon_box info">
							<view class="icon_mask"><uni-icons :style="iconStyle" type="phone-filled" size="36"></uni-icons></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mo-dialog ref="modelDialog" @confirm="contactUs" title="联系我们" confirmText="拨打电话">
			<view class="contactUs">
				老年病学科：<text style="color: #73c8ff;">0773-3840447</text>
			</view>
		</mo-dialog>
		<mo-dialog ref="setVolume" title="音量设置" confirmText="确定">
			<view class="set_volume_box">
				<slider :value="volume" @change="volumeChange" @changing="sliding" step="3" max="30" show-value/>
			</view>
		</mo-dialog>
	</view>
</template>

<script>
	import LOCATION from '../../common/location/location';
	let _this;
	export default {
		data() {
			return {
				// statusbarHeight: 45,
				device: {
					deviceName: '默认药盒',
				},
				volume: 20,
				iconStyle: "background-image: linear-gradient(#ffffff, #c9e3fe); -webkit-background-clip: text;background-clip: text;color: transparent;font-weight:bloder;"
				// defaultVol: 20
			}
		},
		async onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			console.log(this.device)
			// this.statusbarHeight = uni.getStorageSync('SET_STATUS_BAR') * 2
		},
		onShow() {
			setTimeout(() => {
				this.authorizeLandB()
			}, 100)
		},
		methods: {
			// 打开蓝牙
			setBluebooth() {
				const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter');
				const blueadapter = BluetoothAdapter.getDefaultAdapter();
				if (blueadapter != null) {
					return blueadapter.enable();
				}

			},
			//  授权打开蓝牙和定位
			async authorizeLandB() {
				const locationState = this.locationState = await LOCATION()
				if (locationState) {
					this.BLE.onAdapterState(state => {
						console.log('state', state)
						//TODO: 查询到状态后重新加载数据
					})
					const adapterRes = await this.BLE.openBluetoothAdapter()
					if (adapterRes.code == 0) {
						// this.BLE.onAdapterState(state => {
						// 	console.log('state', state)
						// })
						this.tolink()
						this.adapterState = await this.BLE.getBluetoothAdapterState()
						
					} else {
						uni.showModal({
							title: '提示',
							content: '蓝牙尚未打开，请打开蓝牙！',
							success: ({
								confirm,
								cancel
							}) => {
								if (confirm) {
									this.setBluebooth()
								}
								// if(cancel){

								// }
							}
						});
					}
				}
			},
			findPillBox() {
				if (this.finding) {
					this.finding = false
					this.BLE.searchDeviceClose()
				} else {
					this.finding = true
					this.BLE.searchDeviceOpen()
				}
			},
			async tolink() {
				const connectionDev = await this.BLE.createBLEConnection(this.device)
				const vRes = await this.BLE.getVersion()
				if(vRes.code == 0) this.device = {...this.device, version:vRes.data}
				const volRes = await this.BLE.getVolume()
				if(volRes.code == 0) this.volume = volRes.data
			},
			contactUs(e) {
				uni.makePhoneCall({
					phoneNumber: '0773-3840447'
				})
			},
			async saveVolume(volume) {
				const setRes = await this.BLE.setVolume(volume)
				if(setRes.code == 0) {
					uni.showToast({
						title: '设置成功！',
					});
				} else {
					uni.showToast({
						title: '设置失败！请重新蓝牙链接设备后重试',
					});
				}
			},
			// back() {
			// 	uni.navigateBack()
			// },
			toFeedback() {
				uni.navigateTo({
					url: '../feedback/index?device=' + JSON.stringify(this.device)
				})
			},
			toHistory() {
				uni.navigateTo({
					url: '../history/index?device=' + JSON.stringify(this.device)
				})
			},
			toAlarmSetting() {
				uni.navigateTo({
					url: '../alarmSetting/index?device=' + JSON.stringify(this.device)
				})
			},
			toVideoList() {
				// console.log('视频跳转')
				uni.navigateTo({
					url: '../playVideo/videoList?device=' + JSON.stringify(this.device)
				})
			},
			async volumeChange(e) {
				const volume = this.volume = e.detail.value
				this.saveVolume(volume)
			},
			sliding(e) {
				uni.vibrateShort({
					success(){console.log(e.detail.value)},
				});
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
		// background-image: linear-gradient(#7067ff, #4377fd 10%, #f1f5fc 82%);
	}

	// .header {
	// 	display: flex;
	// 	align-items: center;
	// 	height: 100rpx;
	// 	line-height: 100rpx;
	// 	font-size: 40rpx;
	// 	font-weight: 900;
	// 	color: #FFF;
	// 	padding-left: 12rpx;

	// 	image {
	// 		width: 50rpx;
	// 		height: 50rpx;
	// 		margin-right: 16rpx;
	// 	}

	// 	.header_rBtn {
	// 		display: flex;
	// 		align-items: center;
	// 		position: absolute;
	// 		height: 100rpx;
	// 		line-height: 100rpx;
	// 		font-size: 32rpx;
	// 		font-weight: 600;
	// 		right: 32rpx;
	// 		color: #fefefe;
	// 	}
	// }

	.pill_box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		position: relative;
		background-image: linear-gradient(to top,  #f8f8f8, #d6ddf8 40%, #f8f8f8 82%);
		height: 270rpx;
		.pill_box_image {
			width: 360rpx;
			height: 270rpx;
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -135rpx;

			image {
				width: 360rpx;
				height: 270rpx;
			}
		}
		.pill_box_msg{
			padding: 32rpx;
			.pill_box_name{
				font-size: 40rpx;
				font-weight: 700;
			}
			.pill_box_state{
				font-size: 32rpx;
			}
			.pill_box_blename{
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	.search_box {
		width: 100%;
		height: 200rpx;
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
			width: 200rpx;
			height: 140rpx;
			border-radius: 24rpx;
			font-size: 32rpx;
			font-weight: 700;
			line-height: 60rpx;

			&.blud {
				border: 8rpx solid #c3e4ff;
				background: linear-gradient(-45deg, #007AFF, rgba(0, 122, 255, 0.5));
				color: #c3e4ff;
			}

			&.indigo {
				border: 8rpx solid #cdf9ff;
				background: linear-gradient(-45deg, #0dc8e3, rgba(13, 200, 227, 0.5));
				color: #cdf9ff;
			}

			&.violet {
				border: 8rpx solid #f5dffe;
				background: linear-gradient(-45deg, #b94efc, rgba(185, 78, 252, 0.5));
				color: #f5dffe;
			}

			&.loading {
				animation: load 2s linear 0s infinite;
			}
		}
	}

	// .tabbar_box {
	// 	position: absolute;
	// 	bottom: 0;
	// 	height: 130rpx;
	// 	width: 100%;
	// 	display: flex;
	// 	flex-direction: row;
	// 	justify-content: space-between;
	// 	align-items: center;
	// 	background-color: #FFF;

	// 	.tabbar_item {
	// 		height: 130rpx;
	// 		flex: 1;
	// 		display: flex;
	// 		flex-direction: row;
	// 		justify-content: center;
	// 		align-items: center;
	// 		color: #666;
	// 	}
	// }
	.menu_box{
		height: calc(100vh - 410rpx);
		background-color: #FFF;
		border-top-right-radius: 32rpx;
		border-top-left-radius: 32rpx;
		box-shadow: 5px -5px 9px #e9e9e9;
		padding-top: 32rpx;
		
		.menu_groud{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
		}
		.menu_item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: calc(100%/2);
			height: 200rpx;
			margin: 12rpx 0;
		}
		.menu_btn{
			width: 86%;
			height: 180rpx;
			position: relative;
			padding: 48rpx 32rpx 32rpx 32rpx;
			box-sizing: border-box;
			border-radius: 15px;
			overflow: hidden;
			color: #444;
			font-weight: 700;
			// background: linear-gradient(225deg, #ffffff, #e6e6e6);
			
			// backdrop-filter: blur(15px);
			background-color: rgba(208, 226, 250, 0.4);
			
			// background-color: #e9f1fa;
			// background-image: linear-gradient(#7067ff, #4377fd 0%, #f1f5fc 40%);
			background-image: radial-gradient(circle at 90% 0%, rgba(208, 227, 250, 0.4) 40%, transparent 40.5%);
			box-shadow:  -5rpx 5rpx 15rpx #ececec,
			             5rpx -5rpx 10rpx #ffffff;
		}
		.icon_box{
			position: absolute;
			bottom: 0;
			right: -36rpx;
			width: 140rpx;
			height: 140rpx;
			border-radius: 40rpx;
			line-height: 140rpx;
			text-align: center;
			.icon_mask{
				position: absolute;
				bottom: -12rpx;
				right: 24rpx;
				width: 140rpx;
				height: 140rpx;
				backdrop-filter: blur(4px);
				border-radius: 40rpx;
				background-color: rgba(208, 226, 250, 0.2);
				box-shadow:  -0px -0px 4rpx #ffffff,
							0rpx 0rpx 4rpx #e8e8e8;
				            
							 color: #b94efc;
			}
			
			&.blud {
				background: linear-gradient(-45deg, #007AFF, rgba(0, 122, 255, 0.8));
				border-radius: 50%;
				.icon_mask{
					border-radius: 50%;
				}
			}
			
			&.indigo {
				background: linear-gradient(-45deg, #0dc8e3, rgba(13, 200, 227, 0.8));
				border-top-right-radius: 50%;
				.icon_mask{
					border-top-right-radius: 50%;
				}
			}
			
			&.violet { 
				background: linear-gradient(-45deg, #af7cfc, rgba(175, 124, 252, 0.8));
				transform:rotate(45deg);
				bottom: -12rpx;
				right: -42rpx;
				.icon_mask{
					bottom: -28rpx;
					right: 16rpx;
				}
			}
			
			&.info { 
				background: linear-gradient(-45deg, #ffc665, rgba(255, 198, 101, 0.8));
				border-top-left-radius: 50%;
				.icon_mask{
					border-top-left-radius: 50%;
				}
			}
		}
	}
	.volumeChange{
		width: 300rpx;
		flex: 1;
	}
</style>