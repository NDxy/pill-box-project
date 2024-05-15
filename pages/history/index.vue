<template>
	<view class="content">
		<view class="history_box">
			<view class="history_list">
				<view class="list_item" v-for="(item, index) in history" :key="index">
					<view class="msg_info">
						<view class="list_title">{{item.alarmName}}</view>
						<view class="list_content">{{item.useTime}}</view>
					</view>
					<view class="state" :class="item.state == 'Y' ? 'use' : 'unuse'">{{item.state == 'Y' ? '已准时用药' : '未准时用药'}}</view>
				</view>
			</view>
		</view>
		<view class="list_box card card_btn btn_warning" @click="showDialog">
			清空记录
		</view>
		<mo-dialog type="default" ref="modelDialog" title="温馨提示" content="删除所有的用药记录后将不可再恢复, 请确认是否删除所有用药记录？" confirm-color="#dd524d"  @confirm="dialogConfirm"/>
	</view>
</template>

<script>
	let _this;
	export default {
		data() {
			return {
				history: [{
					alarmId: 1,
					alarmName: '9:20',
					NO: '8858',
					useTime: '2024-05-09',
					state: 'Y'
				}],
				device: {}
			}
		},
		async onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			this.refresh()
		},
		methods: {
			refresh(){
				this.history = uni.getStorageSync(this.device.deviceId + '__history')
				console.log(this.history)
			},
			showDialog(){
				this.$refs.modelDialog.showDialog()
			},
			back(){
				uni.navigateBack()
			},
			dialogConfirm(){
				uni.removeStorageSync(this.device.deviceId + '__history')
				this.refresh()
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
	.card{
		border-radius: 24rpx;
		margin: 24rpx;
	}
	.card_btn{
		text-align: center;
		&.btn_primary{
			color: #007aff;
		}
		&.btn_warning{
			color: #dd524d;
		}
	}
	.list_box{
		// width: 100%;
		background-color: #FFF;
		padding: 32rpx;
		box-sizing: border-box;
		// position: relative;
	}
	
	.history_box{
		// width: 100%;
		background-color: #FFF;
		padding: 32rpx;
		box-sizing: border-box;
		// position: relative;
	}
	
	
	.list_item{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0;
		border-bottom: 1rpx double #eee;
		box-sizing: border-box;
		&:last-child{
			border: none
		}
	}
	.list_title{
		font-weight: 600;
	}
	.list_content{
		font-size: 28rpx;
		color: #999;
	}
	
	.state{
		font-size: 28rpx;
		&.unuse{
			color: #ff5200;
		}
		&.use{
			color: #79c6f9;
		}
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
	
	
</style>
