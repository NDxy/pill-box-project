<template>
	<view class="custom_popup_checkbox" :class="{ popup_show: showPopup }">
		<view class="popup_mask" @click="showPopup = false"></view>
		<view class="popup_content">
			<text class="popup_share_title">{{title}}</text>
			<scroll-view scroll-y="true" class="schoolList" @scrolltolower="scroll">
				<checkbox-group v-if="rangeData.length>0" @change="changeItem">
					<label v-for="(item,index) in rangeData" :key="index" class="item">
						<text>{{item[rangeKey]}}</text>
						<checkbox  color="#007AFF" :value="item.value+''" :checked="item.checked"/>
					</label>
				</checkbox-group>
				<view v-else class="no-content">
					<text>无相关数据</text>
				</view>
			</scroll-view>
			<view class="popup_share_btn">
				<text class="" @click="showPopup = false;">取消</text>
				<!-- <text class="" @click="showPopup = false;">确认</text> -->
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @Author: NXJ
	 */
	export default {
		name: 'CustomPopupCheckbox',
		props: {
			value: {
				type: [Boolean, String],
				default: false
			},
			title: {
				type: String,
				default: '请选择'
			},
			range: {
				type: Array,
				default: () => []
			},
			rangeKey: {
				type: String,
				default: 'text'
			}
		},
		data() {
			return {
				showPopup: false,
				popupTitle: '请选择',
				indexValue: '',
				totalList: [],
				currentPage: 1,
				pageSize: 20,
				searchValue: '',
				rangeData:this.range
			};
		},
		watch: {
			value(newVal) {
				this.showPopup = newVal
			},
			title(newTitle) {
				this.popupTitle = newTitle
			},
			showPopup(newVal){
				this.$emit("input",newVal);
			},
			range(newVal){
				this.rangeData = newVal
			}
		},
		mounted() {
			// this.getList("")
		},
		methods: {
			scroll() {
				this.currentPage += 1
				this.getList(this.searchValue)
			},
			changeItem(e) {
				
				let items = this.rangeData,
					values = e.detail.value,
					textValues = ''
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.value)){
						textValues += ' ' + item.text
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
				this.indexValue = values
				const bit = items.reduceRight((accumu, current) => {
					return (typeof accumu == 'string' ? accumu : +accumu.checked) + '' + (+current.checked)
				})
				textValues = bit === '1111111' ? '每天' : textValues
				this.$emit('change', {values: values, bit, textValues } )
			},
			clearItem() {
				this.indexValue = ''
			},
		}
	}
</script>

<style lang="scss">
	.custom_popup_checkbox {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 199;
		display: none;
		&.popup_show{
			display: block;
		}
		.popup_mask {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: rgba($color: #000000, $alpha: 0.3);
		}

		.popup_content {
			height: 80%;
			width: 100%;
			display: flex;
			position: absolute;
			bottom: 0;
			flex-direction: column;
			background-color: #FFF;
			border-top-right-radius: 36upx;
			border-top-left-radius: 36upx;
		}

		.search_input {
			height: 40rpx;
			padding: 30rpx 20rpx;
			border-bottom: 1px #f5f5f5 solid;
		}

		.schoolList {
			width: 100%;
			height: calc(100% - 200rpx);
			.no-content{
				padding: 100rpx 24rpx;
				text-align: center;
				color: #999;
				font-size: 32rpx;
			}
		}

		.item {
			padding: 0 24upx;
			line-height: 100upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.popup_share_btn,
		.popup_share_title {
			height: 100rpx;
			line-height: 100rpx;
			font-weight: bolder;
			border-bottom: 1px #f5f5f5 solid;
			text-align: center;
			color: #333;
		}

		.popup_share_btn {
			display: flex;
			justify-content: space-around;
			color: #007AFF;
			border: none;
			border-top: 1px #f5f5f5 solid;

			text {
				width: 50%;
			}
		}
	}
</style>
