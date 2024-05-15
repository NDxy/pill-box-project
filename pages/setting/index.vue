<template>
	<view class="content">
		<view class="header" :style="'padding-top:'+ parseInt(+statusbarHeight) + 'rpx'">
			<uni-icons @click="back" style="color: #fefefe;" type="left" size="24"></uni-icons> <text style="flex: 1;text-align: center;">设置中心</text><text></text>
		</view>
		<view class="search_box">
			<view class="search_icon blud" @click="clearStorageSync">
				<text class="iconfont icon-lanya"></text>
				<text>清除所有记录</text>
			</view>
		</view>
		<!-- <view class="ble_list_box">
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
		</view> -->
	</view>
</template>

<script>
	import LOCATION from '../../common/location/location';
	let _this;
	export default {
		data() {
			return {
				statusbarHeight: 45
			}
		},
		async onLoad() {
			this.statusbarHeight = uni.getStorageSync('SET_STATUS_BAR') * 2
			_this = this;
		},
		methods: {
			async clearStorageSync(){
				uni.clearStorageSync()
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
