<template>
	<view class="content">
		<view class="intor">
			<view class="user-info">
				<u-avatar :src="info.zbm_avatarUrl"></u-avatar>
				<view class="user-name">
					<view class="">{{ info.zbm_nickName }}</view>
					<view class="time">{{ $u.timeFrom(new Date(info.last_modify_time), 'yyyy年mm月dd日 hh时MM分') }}</view>
				</view>
				<view class="hot">
					<u-icon name="eye" size="28" :color="$u.color.primary" :label="info.visitors" />
					<view class="gap"></view>
					<u-icon name="heart" size="28" :color="$u.color.error" :label="info.collectors" />
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
			<u-icon v-show="isFollow" name="heart-fill" color="#dd6161" size="48" @click="removeFollow(id)"></u-icon>
			<u-icon v-show="!isFollow" name="heart" :color="$u.color['info']" size="48" @click="addFollow(id)"></u-icon>
			<view class="buttom-group">
				<u-button :ripple="true" ripple-bg-color="#909399" type="primary" size="medium" @click="copyPhone(info.wx_account, 'wx_account')">复制微信号</u-button>
				<u-button :ripple="true" ripple-bg-color="#909399" type="primary" size="medium" @click="copyPhone(info.zbm_phoneNumber, 'phone')">复制微信手机号</u-button>
			</view>
		</view>
		
		<u-modal v-model="copyComplate" :show-title="false" @confirm="uploadComplateFn">
			<view class="tips">
				<view>未收到货时,请勿提前转账,防止被骗子骗取钱财!!!</view>
				<view>{{tips}}</view>
			</view>
		</u-modal>
		
		<view class="backHome">
			<u-icon name="/static/img/tabbar/home-a.png" size="48" @click="backHome"></u-icon>
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
				isFollow: false,
				transfTradeType: utils.transfTradeType,
				photoList: [],
				copyComplate: false,
				tips: '',
				userInfo: '',
			}
		},
		onLoad(option) {
			// console.log(this.$u.color)
			this.id = option.id;
			this.getListDetail(option)
			this.userInfo = uni.getStorageSync('userInfo')
			this.checkFollow(this.id)
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
			checkFollow(id) {
				console.log(id, this.userInfo.zbm_follow_lists)
				if (this.userInfo.zbm_follow_lists.includes(id)) {
					this.isFollow = true
				}
			},
			addFollow(id) {
				this.$u.throttle(() => {
					api.addFollow({id})
						.then(res => {
							if (res.success) {
								getApp().globalData.followList.push(this.info._id);
								this.isFollow = true;
								this.$u.toast('关注成功');
							}
						})
						.catch(e => {
							this.$u.toast(e);
						})
				}, 800, true)
			},
			removeFollow(id) {
				this.$u.throttle(() => {
					api.remove({id})
						.then(res => {
							if (res.success) {
								const index = getApp().globalData.followList.indexOf(this.info._id)
								getApp().globalData.followList.splice(index, 1)
								this.isFollow = false;
								this.$u.toast('取消关注');
							}
						})
						.catch(e => {
							this.$u.toast(e);
						})
				}, 800, true)
			},
			copyPhone(value, type = 'phone') {
				uni.setClipboardData({
					data: value,
					success: () => {
						uni.hideToast();
						this.$nextTick(() => {
							this.copyComplate = true;
							this.tips = `已复制${type === 'phone' ? '手机号' : '微信号'}: ${value}`
						})
					}
				});
			},
			async getImg(url) {
				const res = await utils.getWxImg(url);
				return res;
			},
			backHome() {
				uni.switchTab({
					url: '../index/index',
				})
			}
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
			
			.hot {
				height: 90rpx;
				margin-left: auto;
				display: flex;
				align-items: flex-end;
				justify-content: flex-end;
				
				.gap {
					width: 30rpx;
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
		justify-content: space-between;
		background-color: #FFFFFF;
		box-shadow: 0 -2rpx 4rpx 2rpx rgba(0, 0, 0, 0.6);
	}
	
	.buttom-group {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		
		> u-button {
			margin-right: 30rpx;
		}
		
		> u-button:last-child {
			margin-right: 0;
		}
		
		/deep/ .u-size-medium {
			padding: 0 30rpx!important;
		}
	}
	
	.tips {
		padding: 30rpx;
		line-height: 2;
	}
</style>
