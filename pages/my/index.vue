<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-20">
				<u-avatar :src="userInfo.zbm_avatarUrl" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userInfo.zbm_nickName}}</view>
			</view>
<!-- 			<view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view> -->
		</view>
<!-- 		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
			</u-cell-group>
		</view> -->
		
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="coupon" title="卡券"></u-cell-item> -->
				<u-cell-item icon="plus" title="发布" @click="showDetail('myPost')"></u-cell-item>
				<u-cell-item icon="heart" title="关注" @click="showDetail('myFollow')"></u-cell-item>
			</u-cell-group>
		</view>
		
		<!-- <view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
			</u-cell-group>
		</view> -->
		
		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
		
		<u-toast ref="uToast" />
		
		<u-popup v-model="loginPopup" :safe-area-inset-bottom="true" :mask-close-able="false" :border-radius="10" mode="bottom">
			<view class="loginBtn">
				<u-button type="primary" @click="getUserInfo">登录周边卖</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import tabbarSetting from '../../static/tabbarSetting';
	import api from '../../common/server/api/index.js'
	import { utils } from '../../common/utils.js'
	
	export default {
		data() {
			return {
				userInfo: {},
				tabbar: tabbarSetting,
			}
		},
		onShow() {
			const id = uni.getStorageSync('userInfo')
			if (id) {
				this.createUser()
				this.userInfo = uni.getStorageSync('userInfo')
			} else {
				this.loginPopup = true
			}
		},
		methods: {
			getUserInfo() {
				const that = this
				wx.getUserProfile({
				    desc: '用于完善会员资料', 
				    success(res) {
				        that.userInfo = res.userInfo,
						that.createUser(that.userInfo)
				    },
				    fail() {
						that.showToast("获取用户信息失败！", 'error')
				    }
				})
			},
			createUser(data) {
				api.createUser(data).then(res => {
					if (res.success) {
						this.loginPopup = false
						uni.setStorageSync('userInfo', res.data.data)
					} else {
						this.showToast("获取用户信息失败！", 'error')
					}
				}).catch(err => {
					this.showToast("获取用户信息失败！", 'error')
					this.loginPopup = true
				})
			},
			showDetail(page) {
				uni.navigateTo({
					url: `../${page}/index`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}

.loginBtn {
		padding: 100rpx 120rpx;
	}
</style>
<style>
	page{
		background-color: #ededed;
	}
</style>
