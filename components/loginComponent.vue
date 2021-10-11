<template>
	<u-popup v-model="value" :safe-area-inset-bottom="true" :mask-close-able="false" :border-radius="10" mode="bottom">
		<view class="loginBtn">
			<u-button type="primary" @click="getUserInfo">登录周边卖</u-button>
			<u-button type="error" style="margin-top: 10px; display: block;" @click="close()">不登录，继续体验</u-button>
		</view>
	</u-popup>
</template>

<script>
	import api from '../common/server/api/index.js'
	
	export default {
		name:"loginComponent",
		props: {
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			
		},
		data() {
			return {
				
			};
		},
		methods: {
			getUserInfo() {
				const that = this
				wx.getUserProfile({
				    desc: '用于完善会员资料', 
				    success(res) {
				        that.userInfo = res.userInfo,
						that.$emit('loginCallBack', that.userInfo)
				    },
				    fail() {
						that.showToast("获取用户信息失败！", 'error')
				    }
				})
			},
			close() {
				this.$emit('cancel', false);
				this.$emit('input', false);
			},
		}
	}
</script>

<style lang="scss" scoped>
.loginBtn {
	padding: 100rpx 120rpx;
}
</style>
