<template>
	<view class="content">
		<view class="list_box card">
			<view class="list">
				<mo-time-picker v-model="alarm.time" icon="birthday" hint="请选择提醒时间">提醒时间</mo-time-picker>
				<view class="list_item" @click="setNameHandle">
					<view class="msg_info">
						<view class="list_title">设备名称</view>
					</view>
					<view class="state disable">{{alarm.name}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
				<view class="list_item" @click="showOrg = true">
					<view class="msg_info">
						<view class="list_title">播报语音</view>
					</view>
					<view class="state disable">{{alarm.video}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
				<view class="list_item" @click="showPlayType = true">
					<view class="msg_info">
						<view class="list_title">重复方式</view>
					</view>
					<view class="state disable">{{alarm.playType}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
			</view>
		</view>
		<view class="list_box card card_btn btn_primary" @click="submit">
			{{alarm.alarmId == '' ? '完成新增' : '修改保存'}}
		</view>
		<custom-popup-checkbox title="选择重复方式" ref="popupOrg" v-model="showPlayType" :range="playTypeRange" @change="changePlayType"></custom-popup-checkbox>
		<custom-popup-radio title="选择播报语音" ref="popupOrg" v-model="showOrg" :range="videoRange" @change="changeVideo"></custom-popup-radio>
		<mo-dialog :type="diaType" ref="modelDialog" :content="diaContent" :confirm-color="diaConfirmColor" :input-value="alarm.name" :title="diaTitle" input-placeholder="请输入设备名称" @confirm="dialogConfirm"/>
	</view>
</template>

<script>
	let _this;
	import { randomNum } from '../../common/bluetooth/BLE_util.js';
	export default {
		data() {
			return {
				alarm: {
					alarmId: '',
					time: '',
					name: '',
					video: '',
					videoId: '',
					playTypeBit: '',
					playType: ''
				},
				deviceAlarmList: [],
				device:{},
				diaTitle: '温馨提示',
				diaType: 'default',
				diaContent: "",
				diaConfirmColor: '#dd524d',
				showOrg: false,
				showPlayType: false,
				playTypeRange:[{
					value:'1',
					text: '星期一'
					},{
					value:'2',
					text: '星期二'
					},{
					value:'3',
					text: '星期三'
					},{
					value:'4',
					text: '星期四'
					},{
					value:'5',
					text: '星期五'
					},{
					value:'6',
					text: '星期六'
					},{
					value:'7',
					text: '星期日'
				}],
				videoRange:[{
					value:'1',
					text: '语言1'
					},{
					value:'2',
					text: '语言2'
					},{
					value:'3',
					text: '语言3'
					},{
					value:'4',
					text: '语言4'
					},{
					value:'5',
					text: '语言5'
					},{
					value:'6',
					text: '语言6'
				}]
			}
		},
		async onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			this.deviceAlarmList = uni.getStorageSync(this.device.deviceId + '__deviceAlarm')
			if(options.alarm){
				this.alarm = JSON.parse(options.alarm)
			}else {
				this.getAlarmId()
			}
			// this.alarm = JSON.parse(options.alarm)
		},
		methods: {
			getAlarmId(){
				const alarmId = randomNum(4)
				const alarmr = this.deviceAlarmList.filter(i => i.alarmId === alarmId)
				if(alarmr.length > 0) {
					this.getAlarmId()
					return
				}
				this.alarm.alarmId = alarmId
			},
			showDialog(){
				this.$refs.modelDialog.showDialog()
			},
			dialogConfirm(e){},
			setNameHandle(){
				this.showDialog()
				this.diaTitle = '设置名称'
				this.diaType = 'input'
				this.diaConfirmColor = '#00aaff'
				this.dialogConfirm = this.setName
			},
			setName(e){
				this.alarm.name = e.inputValue
			},
			submit(){
				this.showDialog()
				if(this.alarm.time == '' || this.alarm.name =='' || this.alarm.playType =='' || this.alarm.videoId ==''){
					this.diaTitle = '温馨提示'
					this.diaType = 'default'
					this.diaContent = `请填写选择完整提醒信息！`
					this.diaConfirmColor = '#00aaff'
					this.dialogConfirm = ()=>{}
				}else {
					this.diaTitle = '温馨提示'
					this.diaType = 'default'
					this.diaContent = `您当前即将添加${this.alarm.playType} ${this.alarm.time} 名称为“${this.alarm.name}”的提醒`
					this.diaConfirmColor = '#00aaff'
					this.dialogConfirm = this.saveAlarm
				}
			},
			changeVideo(e){
				this.alarm.videoId = e.value
				this.alarm.video = e.text
			},
			changePlayType(e){
				console.log(e)
				this.alarm.playTypeBit = '0'+e.bit
				this.alarm.playType = e.textValues
			},
			saveAlarm(){
				console.log(this.deviceAlarmList)
				const newDeviceAlarm = this.deviceAlarmList.filter(i => i.alarmId !== this.alarm.alarmId )
				newDeviceAlarm.push(this.alarm)
				this.deviceAlarmList = newDeviceAlarm
				uni.setStorageSync(this.device.deviceId + '__deviceAlarm', newDeviceAlarm)
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
		width: 140rpx;
		font-weight: 600;
	}
	.list_content{
		font-size: 28rpx;
		color: #999;
	}
	
	.state{
		display: flex;
		align-items: center;
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
