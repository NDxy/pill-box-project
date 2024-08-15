<template>
	<view class="content">
		<view class="list_box card">
			<view class="list">
				<view class="list_item" ><!-- @click="showDevChange = true" -->
					<view class="msg_info">
						<view class="list_title">当前药盒</view>
						<view class="list_content"></view>
					</view>
					<view class="state">{{device.deviceName}} <!-- <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons> --></view>
				</view>
			</view>
		</view>
		<view class="list_box card">
			<view class="list_title title_header">
				<text>意见内容</text>
			</view>
			<view class="list">
				<textarea class="textarea" v-model="feedbackContent" placeholder="请在此处输入反馈的描述" />
			</view>
		</view>
		<view class="list_box card card_btn btn_primary" @click="feedback">
			<uni-icons type="cloud-upload" color="#007aff" size="18"></uni-icons>提交反馈
		</view>
		<mo-dialog type="default" ref="modelDialog" :content="diaContent" title="温馨提示" @confirm="dialogConfirm"/>
		<!-- <custom-popup-radio title="选择播报语音" ref="popupOrg" v-model="showDevChange" :range="deviceList" @change="changeDevice"></custom-popup-radio> -->
	</view>
</template>

<script>
	let _this;
	import { tmcTempLog } from "@/common/request/index.js"
	export default {
		data() {
			return {
				device: {},
				deviceList: [],
				deviceAlarm: [],
				
				feedbackContent: "",
				
				diaContent: "",
				diaConfirmColor: '#dd524d'
			}
		},
		onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			this.deviceList = uni.getStorageSync('devices')
			console.log(this.deviceAlarm)
		},
		onShow() {
		},
		methods: {
			dialogConfirm(e){},
			showDialog(){
				this.$refs.modelDialog.showDialog()
			},
			async clearAllAlarm(){
				const clearRes = await this.BLE.deleteAllAlaem()
				this.showDialog()
				if(clearRes.code == 0){
					uni.removeStorageSync(this.device.deviceId + '__deviceAlarm')
					this.diaContent = '清除所有提醒完成'
					this.diaConfirmColor = '#00aaff'
					this.dialogConfirm = () => {this.refresh()}
				}else {
					this.diaContent = '清除所有提醒失败，请重新链接药盒，再次尝试'
					this.diaConfirmColor = '#00aaff'
					this.dialogConfirm = () => {this.back()}
				}
			},
			back(){
				uni.navigateBack()
			},
			changeVideo(e){
				this.alarm.videoId = e.value
				this.alarm.video = e.text
			},
			async feedback(){
				const res = await tmcTempLog({
					deviceId: this.device.deviceId,
					deviceId: this.feedbackContent
				})
				console.log(res)
				this.showDialog()
				if(res.code == 0){
					this.diaContent = '意见反馈提交成功'
					this.dialogConfirm = () => {this.back()}
				}else {
					this.diaContent = '意见反馈提交失败，再次尝试'
				}
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
	.textarea{
		box-sizing: border-box;
		padding: 24rpx;
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
		&.title_header{
			// width: 1;
			display: flex;
			justify-content: space-between;
		}
	}
	.list_content{
		font-size: 30rpx;
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
