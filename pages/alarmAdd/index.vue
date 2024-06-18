<template>
	<view class="content">
		<view class="list_box card">
			<view class="list">
				<mo-time-picker v-model="alarm.time" icon="birthday" hint="请选择提醒时间">提醒时间</mo-time-picker>
				<view class="list_item" @click="setNameHandle">
					<view class="msg_info">
						<view class="list_title">闹钟名称</view>
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
		<view v-if="!settingAlarm" class="list_box card card_btn btn_primary" @click="submit">
			{{!settingAlarm ? '提交新增' : '修改保存'}}
		</view>
		<view v-if="settingAlarm" class="list_box card card_btn btn_warning" @click="delAlarmHandler">
			删除提醒
		</view>
		<custom-popup-checkbox title="选择重复方式" ref="popupOrg" v-model="showPlayType" :range="playTypeRange" @change="changePlayType"></custom-popup-checkbox>
		<custom-popup-radio title="选择播报语音" ref="popupOrg" v-model="showOrg" :range="videoRange" @change="changeVideo"></custom-popup-radio>
		<mo-dialog :type="diaType" ref="modelDialog" :content="diaContent" :confirm-color="diaConfirmColor" :input-value="alarm.name" :title="diaTitle" input-placeholder="请输入设备名称" @confirm="dialogConfirm"/>
	</view>
</template>

<script>
	let _this;
	import {
		alarmAdd,
		alarmDelete
	} from "@/uni_modules/laoqianjunzi-alarm"; 
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
				settingAlarm: false,
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
					text: '该吃餐前药了',
					path: '../../common/vidoe/该吃餐前药了.mp3'
					},{
					value:'2',
					text: '该吃餐时药了',
					path: '../../common/vidoe/该吃餐时药了.mp3'
					},{
					value:'3',
					text: '该吃餐后药了',
					path: '../../common/vidoe/该吃餐后药了.mp3'
					},{
					value:'4',
					text: '该吃餐后一小时药了',
					path: '../../common/vidoe/该吃餐后一小时药了.mp3'
					},{
					value:'5',
					text: '嘀 嘀 嘀 嘀 (3s)',
					path: '../../common/vidoe/蜂鸣器声音.mp3'
					},{
					value:'6',
					text: '未定义语音',
					path: '../../common/vidoe/未定义播报语音.mp3'
				}]
			}
		},
		async onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			this.deviceAlarmList = uni.getStorageSync(this.device.deviceId + '__deviceAlarm')
			console.log(this.deviceAlarmList)
			if(options.alarm){
				this.alarm = JSON.parse(options.alarm)
				this.settingAlarm = true
			}else {
				this.getAlarmId()
			}
			// this.alarm = JSON.parse(options.alarm)
		},
		methods: {
			getAlarmId(){
				const alarmId = randomNum(4)
				const alarmr = this.deviceAlarmList.length > 0 ? this.deviceAlarmList.filter(i => i.alarmId === alarmId) : []
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
				this.diaTitle = '设置名称'
				this.diaType = 'input'
				this.diaConfirmColor = '#00aaff'
				this.dialogConfirm = this.setName
				this.showDialog()
			},
			setName(e){
				this.alarm.name = e.inputValue
			},
			submit(){
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
				this.showDialog()
			},
			delAlarmHandler(){
				this.diaTitle = '删除警告'
				this.diaType = 'default'
				this.diaContent = `您即将删除${this.alarm.playType} ${this.alarm.time} 名称为“${this.alarm.name}”的提醒！删除之后，次时间将不会再提醒您用药，确定删除吗！！？？`
				this.diaConfirmColor = '#dd524d'
				this.dialogConfirm = this.delAlarm
				this.showDialog()
			},
			changeVideo(e){
				this.alarm.videoId = e.value
				this.alarm.video = e.text
			},
			changePlayType(e){
				console.log(e)
				this.alarm.playTypeBit = '0'+e.bit
				this.alarm.playType = e.textValues
				this.alarm.weekday = e.values.join('')
			},
			async saveAlarm(){
				
				const setRes = await this.BLE.setAlarm({ ...this.alarm, playTypeBit: parseInt(this.alarm.playTypeBit, 2) })
				this.diaTitle = '温馨提示'
				this.diaType = 'default'
				this.diaConfirmColor = '#00aaff'
				if(setRes.code == 0){
					const newDeviceAlarm = this.deviceAlarmList.length > 0 ? this.deviceAlarmList.filter(i => i.alarmId !== this.alarm.alarmId ) : [] 
					const vidoePath = this.videoRange.filter(i => i.value == this.alarm.videoId)[0].path
					console.log(vidoePath)
					newDeviceAlarm.push(this.alarm)
					this.deviceAlarmList = newDeviceAlarm
					uni.setStorageSync(this.device.deviceId + '__deviceAlarm', newDeviceAlarm)
					this.doUtsAdd(vidoePath)
					this.diaContent = `药盒提醒设置成功`
					this.dialogConfirm = ()=>{ 
						uni.navigateBack()
					}
					// uni.redirectTo({
					// 	url: '../alarmSetting/index'
					// })
				}else {
					this.diaContent = `药盒提醒设置失败，${setRes.msg}`
					this.dialogConfirm = ()=>{}
				}
				this.showDialog()
			},
			async delAlarm(){
				const delRes = await this.BLE.deleteAlaem(this.alarm.alarmId)
				this.diaTitle = '温馨提示'
				this.diaType = 'default'
				this.diaConfirmColor = '#00aaff'
				if(delRes.code == 0){
					const newDeviceAlarm = this.deviceAlarmList.filter(i => i.alarmId !== this.alarm.alarmId )
					uni.setStorageSync(this.device.deviceId + '__deviceAlarm', newDeviceAlarm)
					// uni.redirectTo({
					// 	url: '../alarmSetting/index'
					// })
					this.doUtsDelete()
					this.diaContent = `药盒提醒删除成功`
					this.dialogConfirm = ()=>{ 
						uni.navigateBack()
					}
				}else {
					this.diaContent = `药盒提醒删除失败，${delRes.msg}`
					this.dialogConfirm = ()=>{}
				}
				this.showDialog()
			},
			doUtsAdd(path) {
				let params = {
					name : this.alarm.name, //闹铃名称
					weekday : this.alarm.weekday, //重复星期
					hour : +this.alarm.time.split(':')[0], //闹铃时
					minutes : +this.alarm.time.split(':')[1], //分钟
					// ringtone : 'https://jubaomusics.oss-cn-beijing.aliyuncs.com/%E4%B8%89%E5%8F%AA%E5%B0%8F%E7%8C%AA/%E4%B8%89%E5%8F%AA%E5%B0%8F%E7%8C%AA.mp3', //铃声
					ringtone : path, //铃声
				}
				alarmAdd({
					params:params,
					success: (res) => {
						console.log('success', res)
				
					},
					fail: (res) => {
						console.log('fail', res)
					}, 
					complete: () => {
						console.log('complete')
					},
				})
			},
			doUtsDelete() {
				alarmDelete()
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
