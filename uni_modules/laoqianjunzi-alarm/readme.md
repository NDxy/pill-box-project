# laoqianjunzi-calender

> uni-app 开发 android (ios暂定)平台设置日历提醒  


### 使用介绍

1. 使用 HBuilderx 导入插件，在相关文件中引入

```
<template>
	<view>
		<view class="btn" @click="doUtsAdd">
			Uts添加闹铃
		</view>
		<view class="btn" @click="doUtsDelete">
			Uts删除闹铃
		</view>
	</view>
</template>

<script>
	const app = getApp();

	import {
		alarmAdd,
		alarmDelete
	} from "@/uni_modules/laoqianjunzi-alarm"; 

	export default {
		data() {
			return {

			};
		},

		methods: {
			doUtsAdd() {
			
				let params = {
					name : 'dida', //闹铃名称
					weekday : '123456', //重复星期
					hour : 10, //闹铃时
					minutes : 14, //分钟
					ringtone : 'https://jubaomusics.oss-cn-beijing.aliyuncs.com/%E4%B8%89%E5%8F%AA%E5%B0%8F%E7%8C%AA/%E4%B8%89%E5%8F%AA%E5%B0%8F%E7%8C%AA.mp3', //铃声
				}
				alarmAdd({
					params:params,
					success: (res) => {
						console.log('success', res)
				
					},
					fail: (res) => {
						console.log('fail', res)
					},
					complete: () => {
						console.log('complete')
					},
				})
			},
			doUtsDelete() {
				alarmDelete()
			},


		},
	};
</script>
```

2. 方法说明

|参数|类型|必填|说明|
|--|:--|--|--|
|params|Object|是|调用参数|
|success|Function|否|接口调用成功的回调函数	|
|fail|Function|否|接口调用失败的回调函数	|
|complete|Function|否|接口调用结束的回调函数（调用成功、失败都会执行）|



3. alarmAdd 参数一对象值说明

|字段|描述|默认值|是否必填|
|--|:--|--|--|
|name|闹铃名称| |是|
|weekday|重复星期| |否|
|hour|小时| |否|
|minutes|分钟| |否|
|ringtone|铃声| |否|



4. 在 manifest.json 文件中找到对应权限并勾选:

```
<uses-permission android:name="com.android.alarm.permission.SET_ALARM" />
<uses-permission android:name="android.permission.SET_ALARM" />
```

### 鼓励作者
如果你觉得该插件方便实用，并且解决了你的问题。可以小小的赞赏一下作者，你的鼓励会更有动力，加油，一起努力。
