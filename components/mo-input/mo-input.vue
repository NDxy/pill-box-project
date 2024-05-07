<template>
	<view class="mo_form_item">
		<view class="form_item_main">
			<view class="icon" v-if="icon != ''">
				<image :src="'../../static/icon/' + icon + '.png'" mode="scaleToFill"></image>
			</view>
			<view class="value">
				<input :type="inputType" :value="valueModel" :maxlength="maxLenght" @input="onControlInput" :placeholder="placeholder" placeholder-class="hint"/><!-- @blur="onControlBlur" @focus="onControlFocus" -->
			</view>
			<view class="icon clear_icon" v-if="showClear && valueModel!=''" @click="clearInput"> <!-- && type != 'password' -->
				<!-- <image src="../../static/icon/close.png" mode="scaleToFill"></image> -->
			</view>
			<view class="icon see_icon" v-if="type == 'password' && valueModel!=''" @click="showPassword">
				<!-- <image :src="'../../static/icon/'+ (eyes?'nosee':'cansee') +'.png'" mode="scaleToFill"></image> -->
			</view>
			<view v-if="btnRightTxt != ''" class="btn_right" :class="{disabled: rbtnDisabled}" @click="rbtnClick">
				{{btnRightTxt}}
			</view>
		</view> 
	</view>
</template>

<script>
	export default {
		name:"MoInput",
		model: {
			prop: 'value', // 将value作为该组件被使用(被父组件调用)时,v-model能取到的值
			event: 'input' // emit(触发)input的时候，参数的值就是父组件v-model收到的值。
		},
		props:{
			value: {
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: "text"
			},
			placeholder: {
				type: String,
				default: "请输入内容"
			},
			icon: {
				type: String,
				default: ''
			},
			showClear: {
				type: Boolean,
				default: false
			},
			btnRight: {
				type: String,
				default: ''
			},
			rbtnDisabled: {
				type: Boolean,
				default: false
			},
			maxLenght: {
				type: Number,
				default: 200,
			}
		},
		data() {
			return {
				eyes: false,
				inputType: this.type,
				btnRightTxt: this.btnRight
			};
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
		watch: {
			type(newV, oVal){
				this.inputType = type
				this.eyes = newV != 'password'
			},
			btnRight(newV, oVal){
				this.btnRightTxt = newV
			}
		},
		methods:{
			onControlInput(e){
				this.$emit('input', e.detail.value)
			},
			// onControlFocus(e){
			// 	this.$emit('focus',e.detail.value)
			// },
			// onControlBlur(e){
			// 	this.$emit('blur',e.detail.value)
			// },
			clearInput(e){
				this.valueModel = ''
			},
			showPassword(){
				this.eyes = !this.eyes
				this.inputType = this.eyes?'text':'password'
			},
			rbtnClick(){
				if(this.rbtnDisabled){
					return
				}
				this.$emit('rbtnClick')
			}
		}
	}
</script>