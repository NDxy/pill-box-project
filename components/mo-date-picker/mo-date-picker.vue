<template>
	<view class="mo_date_picker">
		<view class="mo_form_item">
			<view class="form_item_main" @click="showPopup = true">
				<view class="icon" v-if="icon != ''">
					<image :src="'../../static/icon/' + icon + '.png'" mode="scaleToFill"></image>
				</view>
				<view class="title">
					<template>
						<text>
							<slot />
						</text>
					</template>
				</view>
				<input class="value align_right" type="text" :value="valueModel" :placeholder="hint" placeholder-class="hint" :disabled="true" @input="onControlInput" />
				<view class="icon right_icon">
					<image :src="'../../static/icon/right.png'" mode="scaleToFill"></image>
				</view>
			</view>
		</view>
		<view class="popup_box" :class="{ popup_show: showPopup }">
			<view class="popup_mask" @click="showPopup = false"></view>
			<view class="popup_content">
				<text class="popup_share_title">{{hint}}</text>
				<view class="picker">
					<picker-view :indicator-style="indicatorStyle" v-model="dateValue" @change="bindChange">
						<picker-view-column>
							<view class="item" v-for="(item,index) in years" :key="item.value">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in months" :key="item.value">{{item}}月</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item,index) in days" :key="item.value">{{item}}日</view>
						</picker-view-column>
					</picker-view>
				</view>
				<view class="popup_share_btn">
					<text class="" @click="confirm">确认</text>
					<text class="" @click="cancel">取消</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	export default {
		name: 'moDatePicker',
		model: {
			prop: 'value', // 将value作为该组件被使用(被父组件调用)时,v-model能取到的值
			event: 'input' // emit(触发)input的时候，参数的值就是父组件v-model收到的值。
		},
		props: {
			value: {
				type: [String, Number, Boolean, Array, Object],
				default: ""
			},
			hint: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: ''
			},
			rbtnDisabled: {
				type: Boolean,
				default: false
			}
		},
		computed: {
            valueModel: {
                get: function () {
                    //实际使用的是value值
                    return this.value;
                },
                set: function (val) {
                    //侦听到setter()事件，将值传递回父级组件
                    this.$emit('input', val);
                }
            }
        },
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1970; i <= date.getFullYear() + 10; i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= mGetDate(year, month); i++) {
				days.push(i)
			}
			return {
				years,
				months,
				days,
				datas: {},
				showPopup: false,
				dateValue: [years.length - 11, month - 1, day - 1],
				indicatorStyle: `height: 50px;`
			};
		},
		mounted() {
			_this = this
			const date = _this.value != '' ? new Date(_this.value) : new Date()
			// const date = new Date()
			const year = date.getFullYear()
			const month = date.getMonth() + 1
			const day = date.getDate()
			_this.dateValue = [_this.years.indexOf(year), month - 1, day - 1]
			_this.datas = {
				value: [year, month, day],
				textCN: dateFtt("yyyy年MM月dd日", new Date(year + '-' + month + '-' + day))/* year + '年 ' + month + '月 ' + day + '日' */,
				text: dateFtt("yyyy-MM-dd", new Date(year + '-' + month + '-' + day)),
			}
		},
		methods: {
			bindChange(e) {
				const val = e.detail.value
				const year = this.years[val[0]]
				const month = this.months[val[1]]
				const day = this.days[val[2]]
				if(val.slice(0, 2).join('') != _this.datas.value.slice(0, 2).join('')){
					this.formatDate(year, month)
				}
				_this.datas = {
					value: val,
					textCN: dateFtt("yyyy年MM月dd日", new Date(year + '-' + month + '-' + day)),
					text: dateFtt("yyyy-MM-dd", new Date(year + '-' + month + '-' + day)),
				}
			},
			confirm() {
				_this.$emit("change", _this.datas);
				this.valueModel = _this.datas.text
				_this.showPopup = false
			},
			cancel() {
				_this.showPopup = false
			},
			onControlInput(e){
				this.$emit('input', e.detail.value)
			},
			formatDate(year, month){
				let days = []
				for (let i = 1; i <= mGetDate(year, month); i++) {
					days.push(i)
				}
				this.days = days
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
	.popup_box {
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
		.picker{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		picker-view {
			width: 86%;
			height: 600rpx;
		}

		.item {
			line-height: 100rpx;
			text-align: center;
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
