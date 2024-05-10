<template>
	<view class="custom_popup_checkbox" :class="{ popup_show: showPopup }">
		<view class="popup_mask" @click="showPopup = false"></view>
		<view class="popup_content">
			<text class="popup_share_title">{{title}}</text>
			<scroll-view scroll-y="true" class="schoolList" @scrolltolower="scroll">
				<checkbox-group v-if="range.length>0" @change="changeItem">
					<label v-for="(item,index) in range" :key="index" class="item">
						<text>{{item[rangeKey]}}</text>
						<checkbox  color="#007AFF" :value="item.value+''" :checked="indexValue == item.value"/>
					</label>
				</checkbox-group>
				<view v-else class="no-content">
					<text>无相关数据</text>
				</view>
			</scroll-view>
			<view class="popup_share_btn">
				<text class="" @click="showPopup = false;">取消</text>
				<text class="" @click="showPopup = false;">确认</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @Author: NXJ
	 */
	export default {
		name: 'CustomPopupRadio',
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
				itemName: '',
				timer: null,
				indexValue: '',
				totalList: [],
				speedNum: 50,
				numCount: 0,
				currentPage: 1,
				pageSize: 20,
				searchValue: ''
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
			searchValue(newValue, oldValue) {
				if(newValue != oldValue) {
					this.currentPage = 1
					this.range = []
				} else if(newValue == '') {
					this.currentPage = 1
				}
			}
		},
		mounted() {
			// this.getList("")
		},
		methods: {
			scroll() {
				this.currentPage += 1
				this.getList(this.searchValue)
				// this.numCount += 1
				// this.popupList = this.popupList.concat(this.totalList.slice(this.speedNum*this.numCount, this.speedNum*(Number(this.numCount) + 1)));
			},
			changeItem(e) {
				// const items = this.range.filter(item => {
				// 	return item.value == e.detail.value
				// })[0]
				// this.itemName = '';
				// this.indexValue = e.detail.value
				// // this.showPopup = false;
				// this.$emit('change', { ...items })
				
				let items = this.range,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.value)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
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
