<template>
	<view class="content">
		<view class="list_box card">
			<view class="list">
				<view class="list_item" @click="resetDeviceNameHandle">
					<view class="msg_info">
						<view class="list_title">修改名称</view>
						<view class="list_content"></view>
					</view>
					<view class="state">{{device.deviceName}} <uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
				<view class="list_item">
					<view class="msg_info">
						<view class="list_title">设备编号</view>
						<view class="list_content"></view>
					</view>
					<view class="state disable">{{device.name}}</view>
				</view>
				<view class="list_item">
					<view class="msg_info">
						<view class="list_title">设备ID</view>
						<view class="list_content"></view>
					</view>
					<view class="state disable">{{device.deviceId}} </view>
				</view>
			</view>
		</view>
		<view class="list_box card">
			<view class="list_title">
				提醒任务列表
			</view>
			<view class="list" v-if="deviceAlarm.length">
				<view class="list_item" v-for="item in deviceAlarm" @click="setAlarm(item)">
					<view class="msg_info">
						<view class="list_title">名称：{{item.name}}</view>
						<view class="list_content">{{item.playType}}|{{item.time}}</view>
						<view class="list_content">语音内容:{{item.video}}</view>
					</view>
					<!-- <view class="state">{{item.alarmTime}}</view> <switch checked="true" @change="" />
					<view class="state">{{device.deviceName}}</view> <switch checked="true" @change="" /> -->
				</view>
			</view>
			<view class="no_content" v-else>
				还没有提醒，新增提醒
			</view>
		</view>
		<view class="list_box card card_btn btn_primary" @click="addAlarm">
			<uni-icons type="plusempty" color="#007aff" size="18"></uni-icons>新增提醒
		</view>
		<view class="list_box card card_btn btn_warning" @click="delAlarmHandle">
			<uni-icons type="trash" color="#dd524d" size="18"></uni-icons>删除设备
		</view>
		<mo-dialog :type="diaType" ref="modelDialog" :content="diaContent" :confirm-color="diaConfirmColor" :input-value="device.deviceName" :title="diaTitle" input-placeholder="请输入设备名称" @confirm="dialogConfirm"/>
	</view>
</template>

<script>
	let _this;
	export default {
		data() {
			return {
				device: {},
				deviceList: [],
				deviceAlarm: [],
				
				
				diaTitle: '温馨提示',
				diaType: 'default',
				diaContent: "",
				diaConfirmColor: '#dd524d'
			}
		},
		async onLoad(options) {
			_this = this;
			this.device = JSON.parse(options.device)
			this.deviceList = uni.getStorageSync('devices')
			this.deviceAlarm = uni.getStorageSync(this.device.deviceId + '__deviceAlarm')
			console.log(this.deviceAlarm)
		},
		methods: {
			dialogConfirm(e){},
			async refresh(){
				// this.list = await this.BLE.getDeviceList()
				// return this.list
				this.getDeviceList()
			},
			resetDeviceNameHandle(){
				this.showDialog()
				this.diaTitle = '重置名称'
				this.diaType = 'input'
				this.diaConfirmColor = '#00aaff'
				this.dialogConfirm = this.resetDeviceName
			},
			delAlarmHandle(){
				this.showDialog()
				this.diaTitle = '删除提示'
				this.diaType = 'default'
				this.diaContent = '删除设备后，所有配置设置和相关记录都将删除，确认删除吗？'
				this.diaConfirmColor = '#dd524d'
				this.dialogConfirm = this.delAlarm
			},
			showDialog(){
				this.$refs.modelDialog.showDialog()
			},
			// 重置设备名称
			resetDeviceName(e){
				this.device.deviceName = e.inputValue
				this.deviceList = this.deviceList.map(i => {
					if(i.deviceId == this.device.deviceId) i.deviceName = e.inputValue
					return i
				})
				uni.setStorageSync('devices', this.deviceList)
			},
			// 删除当前设备
			delAlarm(e){
				uni.removeStorageSync(this.device.deviceId + '__history')
				uni.removeStorageSync(this.device.deviceId + '__deviceAlarm')
				console.log(this.deviceList)
				this.deviceList = this.deviceList.filter(i => {
					return i.deviceId != this.device.deviceId
				})
				console.log(this.deviceList)
				uni.setStorageSync('devices', this.deviceList)
				uni.reLaunch({
					url: '../index/index'
				})
			},
			addAlarm(){
				uni.navigateTo({
					url: '../alarmAdd/index?device=' + JSON.stringify(this.device)
				})
			},
			setAlarm(alarm){
				uni.navigateTo({
					url: '../alarmAdd/index?device=' + JSON.stringify(this.device) + '&alarm=' + JSON.stringify(alarm)
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
