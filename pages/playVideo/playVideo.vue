<template>
	<view>
		<view class="video_box">
			<video :src="video.src" autoplay="true" :title="video.videoName" page-gesture="true"></video>
		</view>
		<view class="video_info">
			<view class="video_title">{{video.videoName}}</view>
			<!-- <view class="video_profile">{{video.}}</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				video: {} 
			};
		},
		onLoad(option) {
			this.video = JSON.parse(decodeURIComponent(option.video))
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.video_box{
		video{
			width: 100vw;
		}
	}
	.video_info{
		padding: 32rpx;
		font-weight: 700;
		font-size: 38rpx;
	}
</style>
