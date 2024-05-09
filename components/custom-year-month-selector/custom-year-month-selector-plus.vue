<template>
	<view class="custom_date_seletor" :class="{ popup_show: showPopup }">
		<view class="popup_mask" @click="showPopup = false"></view>
		<view class="popup_content">
			<text class="popup_share_title">{{title}}</text>
			<view class="picker">
				<picker-view :indicator-style="indicatorStyle" :value="dateValue" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in years" :key="item.value">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in months" :key="item.value">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="popup_share_btn">
				<text class="" @click="confirm">确认</text>
				<text class="" @click="cancel">取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	export default {
		name: 'CustomTabs',
		props: {
			value: {
				type: [Boolean, String],
				default: false
			},
			title: {
				type: String,
				default: '请选择日期'
			}
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			for (let i = 1990; i <= date.getFullYear() + 10; i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			return {
				years,
				months,
				datas: {},
				showPopup: false,
				dateValue: [years.length - 11, month - 1],
				dateText: years[years.length - 11].text + months[month - 1].text,
				indicatorStyle: `height: 50px;`,
				gmtCreateStart: '', //初始查询开始时间
				gmtCreateEnd: '', //初始查询结束时间
			};
		},
		mounted() {
			_this = this
			const date = new Date()
			const year = date.getFullYear()
			const month = date.getMonth() + 1
			_this.gmtCreateStart = dateFtt("yyyy-MM", new Date()) + "-01 00:00:00"; //初始查询开始时间
			_this.gmtCreateEnd = dateFtt("yyyy-MM", new Date()) + "-" + mGetDate() + " 23:59:59"; //初始查询结束时间
			_this.datas = {
				value: [year,month],
				textCN: year + '年' + month + '月',
				text: year + '-' + month,
				sAndeforTime: [_this.gmtCreateStart, _this.gmtCreateEnd],
				sAndeforDate: [dateFtt("yyyy-MM", new Date()) + "-01", dateFtt("yyyy-MM", new Date()) + '-' + mGetDate(year, month)]
			}
		},
		watch: {
			value(newVal) {
				this.showPopup = newVal
			},
			showPopup(newVal) {
				this.$emit("input", newVal);
			},
		},
		methods: {
			bindChange(e) {
				const val = e.detail.value
				const year = this.years[val[0]]
				const month = this.months[val[1]]
				_this.gmtCreateStart = dateFtt("yyyy-MM", new Date(year + '-' + month)) + "-01 00:00:00"
				_this.gmtCreateEnd = dateFtt("yyyy-MM", new Date(year + '-' + month)) + '-' + mGetDate(year, month) + " 23:59:59"
				_this.datas = {
					value: [year,month],
					textCN: year + '年 ' + month + '月',
					text: year + '-' + month,
					sAndeforTime: [_this.gmtCreateStart, _this.gmtCreateEnd],
					sAndeforDate: [dateFtt("yyyy-MM", new Date(year + '-' + month)) + "-01", dateFtt("yyyy-MM", new Date(year + '-' + month)) + '-' + mGetDate(year, month)]
				}

			},
			confirm() {
				_this.$emit("change", _this.datas);
				_this.showPopup = false
			},
			cancel() {
				_this.showPopup = false
			}
		}
	}
	
	function dateFtt(fmt, date) {
		date = new Date(date)
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	
	function mGetDate(year, mouth) {
		var date = new Date();
		var year = year ? year : date.getFullYear();
		var month = mouth ? mouth : date.getMonth() + 1;
		var d = new Date(year, month, 0);
		return d.getDate();
	}
	
	function getValue(data,value){
		let index = 0
		for (let i = 0; i < data.length; i++) {
			if(data[i].value == value) index = i
		}
		return index
		
	}
</script>

<style lang="scss">
	.custom_date_seletor {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -199;
		visibility: hidden;

		// display: none;
		&.popup_show {
			z-index: 199;
			visibility: initial;
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
			height: 800rpx;
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
			height: calc(100% - 300rpx);

			.no-content {
				padding: 100rpx 24rpx;
				text-align: center;
				color: #999;
				font-size: 28rpx;
			}
		}

		picker-view {
			width: 100%;
			height: 600rpx;
			// margin-top: 20rpx;
		}

		.item {
			line-height: 100rpx;
			text-align: center;
			// padding: 0 24upx;
			// line-height: 100upx;
			// display: flex;
			// flex-direction: row;
			// justify-content: space-between;
		}

		.popup_share_btn,
		.popup_share_title {
			height: 100rpx;
			line-height: 100rpx;
			font-weight: bolder;
			border-bottom: 1px #f5f5f5 solid;
			text-align: center;
			color: #333;
			box-sizing: border-box;
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
