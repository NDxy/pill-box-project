<template>
	<view class="custom_date_seletor">
		<view class="date_box">
			<picker mode="multiSelector" :value="dateValue" :valueText="dateText" range-key="text" :range="date" @change="onChange">
				<view class="date_chang">
					<!-- <slot>{{dateText}}</slot> -->
					<slot>{{date[0][dateValue[0]].text+date[1][dateValue[1]].text}}</slot>
					<!-- <image style="width: 48rpx;height: 48rpx;" src="/static/images/down.png" mode="aspectFill"></image> -->
					<image class="down_icon" src="/static/images/down.png" mode="scaleToFill"></image>
				</view>
			</picker>
		</view>
	</view>
</template>

<script>
	/**
	 * @Author: NXJ
	 * @property {Array} value = [year,month] 控件的值
	 */
export default {
		name: 'CustomTabs',
		props: {
			value: {
				type: Array,
				default: () => []
			},
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			for (let i = date.getFullYear() + 10; i >= 1990; i--) {
				years.push({value: i,text: i + "年"})
			}
			for (let i = 1; i <= 12; i++) {
				months.push({value: i,text: i + "月"})
			}
			return {
				years,
				months,
				date: [[...years],[...months]],
				dateValue: [10, month - 1],
				dateText: years[10].text+months[month - 1].text,
				values:{
					type: 'change',
					value: [years[10].value,months[month - 1].value],
					textCN: years[10].text+months[month - 1].text,
					text: years[10].value + '-' + months[month - 1].value,
					sAndeforTime: [this.dateFtt('yyyy-MM-dd', years[10].value + '-' + months[month - 1].value + '-01')+' 00:00:00',this.dateFtt('yyyy-MM-dd', years[10].value + '-' + months[month - 1].value + '-'+ this.mGetDate(years[10].value, months[month - 1].value)) +' 23:59:59'],
					sAndefordate: [this.dateFtt('yyyy-MM-dd', years[10].value + '-' + months[month - 1].value + '-01'),this.dateFtt('yyyy-MM-dd', years[10].value + '-' + months[month - 1].value + '-'+ this.mGetDate(years[10].value, months[month - 1].value))]
				}
			};
		},
		watch: {
			value(newVal){
				let year,month;
				year = this.getValue(this.years,newVal[0])
				month = this.getValue(this.months,newVal[1])
				this.dateValue = [year,month]
			},
		},
		methods:{
			onChange(e){
				this.dateValue = e.target.value
				const [year,month] = [this.date[0][this.dateValue[0]].value, this.date[1][this.dateValue[1]].value]
				this.dateText = year + '年' + month + '月'
				this.values = {
					type: 'change',
					value: [year,month],
					textCN: this.dateText,
					text: year + '-' + month,
					sAndeforTime: [this.dateFtt('yyyy-MM-dd', year + '/' + month + '/01')+' 00:00:00',this.dateFtt('yyyy-MM-dd', year + '/' + month + '/'+ this.mGetDate(year, month))+' 23:59:59'],
					sAndefordate: [this.dateFtt('yyyy-MM-dd', year + '/' + month + '/01'),this.dateFtt('yyyy-MM-dd', year + '/' + month + '/'+ this.mGetDate(year, month))]
				}
				this.$emit('change',this.values)
			},
			dateFtt(fmt, date) {
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
			},
			mGetDate(year, mouth) {
				var date = new Date();
				var year = year ? year : date.getFullYear();
				var month = mouth ? mouth : date.getMonth() + 1;
				var d = new Date(year, month, 0);
				return d.getDate();
			},
			getValue(data,value){
				let index = 0
				for (let i = 0; i < data.length; i++) {
					if(data[i].value == value) index = i
				}
				return index
				
			}
		}
	}
</script>

<style lang="scss">
	.custom_date_seletor{
		// position: relative;
		.date_box{
			padding: 0;
		}
		.date_chang{
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			font-size: 30rpx;
			font-weight: 800;
			color: #3C424F;
			line-height: 42rpx;
		}
		.down_icon{
			width: 48rpx;
			height: 48rpx;
		}
	}
</style>
