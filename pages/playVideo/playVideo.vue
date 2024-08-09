<template>
	<view>
		<view class="video_box">
			<video :src="video.src"></video>
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
			this.video = decodeURIComponent(option.video)
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

</style>
