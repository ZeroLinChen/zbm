<template>
	<view class="content">
		<view class="intor">
			<view class="user-info">
				<u-avatar :src="info.zbm_avatarUrl"></u-avatar>
				<view class="user-name">
					<view class="">{{ info.zbm_nickName }}</view>
					<view class="time">{{ $u.timeFrom(new Date(info.last_modify_time), 'yyyy年mm月dd日 hh时MM分') }}</view>
				</view>
			</view>
			<u-line />
		</view>
		
		<view class="money">
			<view class="flag">¥ </view>
			<view class="cosnt">{{info.discontCost}}</view>
			<u-tag class="tag" :text="transfTradeType(info.tradeType) || ''" type="error" size="mini" />
		</view>
		
		<view class="main">
			{{info.intro}}
			
			<u-image v-for="(item, index) in photoList" :src="item" :key="index" width="100%" mode="widthFix"></u-image>
		</view>
		
		<view class="bottomArea">
			<u-icon name="heart" color="$u.color['info']" size="48" @click="addFollow(id)"></u-icon>
			<u-button :ripple="true" ripple-bg-color="#909399" type="primary" size="medium" @click="copyPhone(info.zbm_phoneNumber, '已复制手机号')">复制微信手机号</u-button>
		</view>
	</view>
</template>

<script>
	import tabbarSetting from '../../static/tabbarSetting';
	import api from '../../common/server/api/index.js'
	import { utils } from '../../common/utils.js'
	
	export default {
		data() {
			return {
				id: '',
				info: {},
				transfTradeType: utils.transfTradeType,
				photoList: [],
			}
		},
		onLoad(option) {
			console.log(option)
			this.id = option.id;
			this.getListDetail(option)
		},
		methods: {
			getListDetail(id) {
				api.getListDetail(id)
					.then(async (res) => {
						console.log(res)
						this.info = res.data.data
						this.photoList = await this.getImg(this.info.photo)
						console.log(this.photoList)
					})
					.catch(e => {
						
					})
			},
			addFollow(id) {
				api.addFollow({id})
					.then(res => {
						console.log(res)
					})
					.catch(e => {
						
					})
			},
			copyPhone(value, tips) {
				uni.setClipboardData({
					data: value,
					success: () => {
						uni.hideToast();
						this.$nextTick(() => {
							this.$u.toast(tips);
						})
					}
				});
			},
			async getImg(url) {
				const res = await utils.getWxImg(url);
				return res;
			},
		}
	}
</script>

<style scoped lang="scss">
	.content {
		width: 750rpx;
		height: 100vh;
		background-color: #FFFFFF;
		padding: 0 20rpx;
	}
	
	.intor {
		width: 100%;
		padding: 20rpx 0;
		
		.user-info {
			padding-bottom: 20rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			
			.user-name {
				padding-left: 30rpx;
				font-size: 36rpx;
				font-weight: bold;
				display: flex;
				flex-direction: column;
				
				.time {
					font-size: 24rpx;
					font-weight: normal;
					color: $u-type-info;
				}
			}
		}
	}
	
	.money {
		color: $u-type-error;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-bottom: 30rpx;
		
		.flag {
			padding-right: 10rpx;
			font-size: 36rpx;
		}
		
		.cosnt {
			font-size: 48rpx;
			font-weight: bold;
			padding-right: 10rpx;
		}
		
		.tag {
			position: relative;
			top: 4rpx;
		}
	}
	
	.main {
		padding-bottom: 100rpx;
		
		u-image {
			padding: 0 30rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			&:first-child {
				padding: 30rpx;
			}
		}
		/deep/ image {
			width: 100%;
		}
	}
	
	.bottomArea {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 100rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background-color: #FFFFFF;
		box-shadow: 0 -2rpx 4rpx 2rpx rgba(0, 0, 0, 0.6);
	}
</style>
