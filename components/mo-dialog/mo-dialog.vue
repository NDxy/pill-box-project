<template>
	<view class="dialog" :class="{'show_dialog': dialogShow}">
		<view class="mask"></view>
		<view class="dialog_box">
			<view class="dialog_title">
				{{title}}
			</view>
			<view class="dialog_content" v-if="type === 'default'">
				<view v-if="content === ''" class="">
					<slot></slot>
				</view>
				<view v-else class="">
					{{content}}
				</view>
			</view>
			<view class="dialog_content" v-else-if="type === 'input'">
				<view class="input_box">
					<input class="input" :type="inputType" v-model="value" @input="inputChange" :placeholder="inputPlaceholder"/>
				</view>
			</view>
			<view class="btn_box">
				<view class="btn btn_left" :style="{'color': cancelColor}" @click="cancel">
					{{cancelText}}
				</view>
				<view class="btn btn_right" :style="{'color': confirmColor}" @click="confirm">
					{{confirmText}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'mo-dialog',
		props: {
			title: {
				type: String,
				default: '温馨提示',
			},
			content: {
				type: String,
				default: '',
			},
			type: {
				type: String,
				default: 'default'
			},
			cancelColor: {
				type: String,
				default: '#999',
			},
			cancelText: {
				type: String,
				default: '取消',
			},
			confirmColor: {
				type: String,
				default: '#00aaff',
			},
			confirmText: {
				type: String,
				default: '确认',
			},
			inputType: {
				type: String,
				default: 'text',
			},
			inputPlaceholder: {
				type: String,
				default: '请输入相关信息',
			},
			inputValue: {
				type: String,
				default: '',
			},
			// dialogShow:{
			// 	type: Boolean,
			// 	default: false
			// }
		},
		data(){
			return {
				value: this.inputValue,
				dialogShow: false
			}
		},
		watch: {
			
			inputValue(newV, oVal){
				this.value = newV
			},
			// btnRight(newV, oVal){
			// 	this.btnRightTxt = newV
			// }
		},
		mounted() {
			// uni.showModal({
			// 	cancelColor: '',
			// 	cancelText: '',
			// 	confirmColor: '',
			// 	confirmText: ''
			// })
		},
		methods: {
			inputChange(e){
				this.$emit('input', e.target.value)
			},
			showDialog(){
				this.dialogShow = true
			},
			confirm(){
				let value = ""
				if(this.type === 'input') value = this.value
				this.dialogShow = false
				this.$emit('confirm', {inputValue: value})
				// this.value = ''
			},
			cancel(){
				this.dialogShow = false
				this.$emit('cancel', null)
				// this.value = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dialog{
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -9;
		visibility: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		&.show_dialog{
			z-index: 999;
			visibility: visible;
		}
	}
	.mask{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.3);
	}
	.dialog_box{
		width: 80%;
		// padding: 32rpx;
		background-color: #FFF;
		border-radius: 18rpx;
		box-shadow: rgba(0, 0, 0, 0.3) 2rpx 2rpx 14rpx;
		position: absolute;
		top: 30%;
		z-index: 1000;
	}
	.dialog_title{
		text-align: center;
		font-size: 36rpx;
		padding: 32rpx;
		font-weight: 600;
	}
	.dialog_content{
		padding: 32rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		min-height: 100rpx;
		text-indent: 64rpx;
		font-size: 32rpx;
	}
	.input_box{
		flex: 1;
		border-bottom: 1rpx solid #eee;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 80rpx;
		.input{
			padding: 12rpx 24rpx;
			box-sizing: border-box;
			outline: none;
			border: none;
			height: 80rpx;
			width: 100%;
		}
	}
	.btn_box{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-top: 0.5rpx solid #eee;
	}
	.btn{
		height: 100rpx;
		line-height: 100rpx;
		flex: 1;
		text-align: center;
		font-weight: 600;
		&.btn_left{
			border-right: 0.5rpx solid #eee;
		}
	}
</style>