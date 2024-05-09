<template>
	<view class="content">
		<view class="list_box card">
			<view class="list">
				<view class="list_item" @click="showDialog">
					<view class="msg_info">
						<view class="list_title">提醒时间</view>
					</view>
					<view class="state">{{alarm.time}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
				<view class="list_item">
					<view class="msg_info">
						<view class="list_title">设备名称</view>
					</view>
					<view class="state disable">{{alarm.name}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
				<view class="list_item">
					<view class="msg_info">
						<view class="list_title">播报语音</view>
					</view>
					<view class="state disable">{{alarm.video}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
				<view class="list_item">
					<view class="msg_info">
						<view class="list_title">重复方式</view>
					</view>
					<view class="state disable">{{alarm.alarmType}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
			</view>
		</view>
		<view class="list_box card card_btn btn_primary" @click="submit">
			{{alarm.alarmId == '' ? '完成新增' : '修改保存'}}
		</view>
		<mo-dialog :type="diaType" ref="modelDialog" :content="diaContent" :confirm-color="diaConfirmColor" :input-value="alarm.name" :title="diaTitle" input-placeholder="请输入设备名称" @confirm="dialogConfirm"/>
	</view>
</template>

<script>
	let _this;
	export default {
		data() {
			return {
				alarm: {
					alarmId: '',
					time: '',
					name: '',
					video: '',
					videoId: '',
					alarmType: ''
				},
				device:{},
				
				diaTitle: '温馨提示',
				diaType: 'default',
				diaContent: "",
				diaConfirmColor: '#dd524d'
			}
		},
		async onLoad(options) {
			_this = this;
			// this.alarm = JSON.parse(options.alarm)
			this.device = JSON.parse(options.device)
		},
		methods: {
			showDialog(){
				this.$refs.modelDialog.showDialog()
			},
			dialogConfirm(e){},
			submit(){
				this.showDialog()
				this.diaTitle = '温馨提示'
				this.diaType = 'default'
				this.diaContent = `当前添加`
				this.diaConfirmColor = '#dd524d'
				this.dialogConfirm = this.saveAlarm
			},
			saveAlarm(){
				uni.setStorageSync(this.device.deviceId + '__deviceAlarm')
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
	.no_content{
		padding: 60rpx;
		text-align: center;
		color: #999;
	}
	
	.list_item{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 0;
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
		color: #333;
		&.disable{
			color: #999;
		}
		// &.unuse{
		// 	color: #ff5200;
		// }
		// &.use{
		// 	color: #79c6f9;
		// }
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
