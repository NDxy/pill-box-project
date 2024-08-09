<template>
	<view class="content">
		<view class="list_box card">
			<view class="list">
				<view class="list_item" v-for="(video, index) in videoList" @click="toPlayVideo(video)" :key="video.videoId">
					<view class="msg_info">
						<view class="list_title">{{video.videoName}}</view>
					</view>
					<view class="state disable"><uni-icons style="margin-left: 24rpx;" type="right"></uni-icons></view>
				</view>
			</view>
		</view>
		<mo-dialog type="default" ref="modelDialog" :content="diaContent" title="温馨提示" input-placeholder="请输入设备名称" @confirm="dialogConfirm"/>
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
				videoList: [{
					videoId:'1',
					videoName: '①糖尿病的基础知识',
					src: 'https://aiassistant.oss-cn-shenzhen.aliyuncs.com/panda/2023/12/31/%E2%91%A0%E7%B3%96%E5%B0%BF%E7%97%85%E7%9A%84%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86.mp4'
					},{
					videoId:'2',
					videoName: '离线消费保障',
					src: '../../common/video/离线消费保障.mp4'
					},{
					videoId:'3',
					videoName: '小达开放消费记录',
					src: '../../common/video/小达开放消费记录.mp4'
					},{
					videoId:'4',
					videoName: 'self-service',
					src: '../../common/video/self-service.mp4'
					},{
					videoId:'5',
					videoName: 'Tab-self-service',
					src: '../../common/video/Tab-self-service.mp4'	
				}],
				device:{},
				diaTitle: '温馨提示',
				diaContent: "",
			}
		},
		async onLoad(options) {
		},
		methods: {
			showDialog(){
				this.$refs.modelDialog.showDialog()
			},
			dialogConfirm(e){
				
			},
			toPlayVideo(video){
				uni.navigateTo({
					url: './playVideo?video=' + encodeURIComponent(video)
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
