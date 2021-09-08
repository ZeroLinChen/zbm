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
					<u-icon name="eye" size="28" label-size="24" :color="$u.color.primary" :label="`浏览数: ${info.visitors}`" />
					<view class="gap"></view>
					<u-icon name="heart" size="28" label-size="24" :color="$u.color.error" :label="`关注数: ${info.collectors}`" />
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
		
		<view class="bottomArea flex-end" v-if="isCreator">
			<view class="bottom-tips">编辑前需下架宝贝</view>
			<view class="buttom-group">
				<u-button v-if="status === 1" :ripple="true" ripple-bg-color="#909399" type="success" size="medium" @click="changeStatus(id, 2)">下架</u-button>
				<u-button v-else-if="status === 2" :ripple="true" ripple-bg-color="#909399" type="primary" size="medium" @click="edit">编辑</u-button>
				<u-button :ripple="true" ripple-bg-color="#909399" type="error" size="medium" @click="changeStatus(id, 0)">关闭</u-button>
			</view>
		</view>
		<view class="bottomArea" v-else>
			<u-icon v-show="isFollow" name="heart-fill" color="#dd6161" size="48" @click="removeFollow(id)"></u-icon>
			<u-icon v-show="!isFollow" name="heart" :color="$u.color['info']" size="48" @click="addFollow(id)"></u-icon>
			<view class="buttom-group">
				<u-button :ripple="true" ripple-bg-color="#909399" type="primary" size="medium" @click="copyPhone(info.wx_account, 'wx_account')">复制微信号</u-button>
				<u-button :ripple="true" ripple-bg-color="#909399" type="primary" size="medium" @click="copyPhone(info.zbm_phoneNumber, 'phone')">复制微信手机号</u-button>
			</view>
		</view>
		
		<u-modal v-model="copyComplate" :show-title="false">
			<view class="tips">
				<view>未收到货时,请勿提前转账,防止被骗子骗取钱财!!!</view>
				<view>{{tips}}</view>
			</view>
		</u-modal>
		
		<u-mask :show="showLoading" :mask-click-able="false">
			<view class="flex-center">
				<u-loading :show="true"></u-loading>
			</view>
		</u-mask>
		
		<view class="msg-box">
			<u-gap height="10" bg-color="#fafafa"></u-gap>
			<view class="title">
				<u-icon name="chat" size="56" margin-left="15" label="消息"></u-icon>
			</view>
			<view class="msg-main">
				<view class="input-area">
					<u-input v-model="msg" type="text" :height="76" :border="true" :placeholder="toWho.zbm_nickName ? `@${toWho.zbm_nickName}` : '向宝贝主咨询'"/>
					<u-button type="primary" @click="sendMsg(msg, toWho)">回复</u-button>
				</view>
				
				<u-line />
				
				<view class="msg-list">
					<view class="msg" v-for="(item, index) in msgList" :key="index">
						<template>
							<u-avatar
								mode="circle"
								size="60"
								:src="item.zbm_avatarUrl"
								bgColor='#fcbd71'
							></u-avatar>
							<view class="msg-leave">
								<view class="msg-content">
									<view class="msg-user-name" @click="reply(item, index)">{{item.zbm_nickName}}:</view>
									{{item.msgContent}}
								</view>
								<view class="msg-time">{{$u.timeFrom(new Date(item.time), 'yyyy年mm月dd日 hh时MM分')}}</view>
							</view>
							<view class="msg-reply" v-if="item.reply">
								<view v-for="(replyItem, replyIndex) in item.reply" :key="replyIndex">
									<view class="msg-content">
										<view class="msg-user-name">@{{replyItem.zbm_nickName}}:</view>
										{{replyItem.msgContent}}
									</view>
									<view class="msg-time">{{$u.timeFrom(new Date(replyItem.time), 'yyyy年mm月dd日 hh时MM分')}}</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		
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
				isCreator: false,
				showLoading: false,
				msg: '',
				msgList: [],
				replyList: [],
				toWho: {},
			}
		},
		computed:{
			status() {
				return this.info.status
			}
		},
		onLoad(option) {
			// console.log(this.$u.color)
			this.id = option.id;
			this.getListDetail(option)
			this.userInfo = uni.getStorageSync('userInfo')
			this.checkFollow(this.id)
		},
		watch: {
			msg(newValue, oldValue) {
				if (!newValue) {
					this.toWho = {};
				}
			}
		},
		methods: {
			getListDetail(id) {
				this.showLoading = true
				api.getListDetail(id)
					.then(async (res) => {
						this.info = res.data.data
						this.checkIsCreator(res.data.data.creatorId)
						this.dealMsg(this.info.msg)
						this.photoList = await this.getImg(this.info.photo)
					})
					.catch(e => {
						
					})
					.finally(() => {
						this.showLoading = false
					})
			},
			checkFollow(id) { // 检查是否在关注列表内
				// console.log(id, this.userInfo.zbm_follow_lists)
				if (this.userInfo.zbm_follow_lists.includes(id)) {
					this.isFollow = true
				}
			},
			checkIsCreator(id) { // 检查是否是创建者
				if (id === this.userInfo._id) {
					this.isCreator = true
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
					api.removeFollow({id})
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
			changeStatus(id, status) {
				this.showLoading = true
				api.changeStatus({id, status}).then(res => {
					this.info.status = status
					this.$u.toast(utils.transfStatus(status));
				})
				.finally(() => {
					this.showLoading = false
				})
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
			},
			edit() {
				uni.navigateTo({
				    url: `../edit/index?id=${this.id}`,
				});
			},
			dealMsg(msgList) {
				const batArr = [];
				const replyList = {};
				msgList.forEach((item, index) => {
					if (item.replyTo) {
						replyList[item.replyTo.id] || (replyList[item.replyTo.id] = []);
						replyList[item.replyTo.id].push(item);
					} else {
						if (replyList[item.id]) {
							item.reply || (item.reply = []);
							item.reply.push(...replyList[item.id]);
						}
						batArr.push(item)
					}
				})
				this.msgList = batArr;
			},
			reply(item, index) { // 控制向谁回复消息
				item.index = String(index);
				const { id, userId, zbm_nickName } = item;
				this.toWho = { id, userId, zbm_nickName };
			},
			sendMsg(msgContent, replyTo) {
				this.showLoading = true;
				api.sendMsg({
					listId: this.info._id,
					userId: this.userInfo._id,
					zbm_nickName: this.userInfo.zbm_nickName,
					zbm_avatarUrl: this.userInfo.zbm_avatarUrl,
					replyTo: replyTo.id ? {
						id: replyTo.id,
						userId: replyTo.userId,
					} : '',
					msgContent
				}).then(res => {
					this.msg = '';
					this.toWho = {};
				})
				.finally(() => {
					this.showLoading = false;
					this.getListDetail({id: this.id});
				})
			},
			isReply(item) {
				return typeof item.replyIndex !== 'string'
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
		padding-bottom: 100rpx;
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
		height: calc(100rpx + var(--safe-area-inset-bottom));
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		box-shadow: 0 -2rpx 4rpx 2rpx rgba(0, 0, 0, 0.6);
		padding-bottom: var(--safe-area-inset-bottom);
		z-index: 1000;
		
		.bottom-tips {
			color: $u-tips-color;
			margin-right: auto;
		}
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
	
	.flex-end {
		justify-content: flex-end;
	}
	
	.tips {
		padding: 30rpx;
		line-height: 2;
	}
	
	.flex-center{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	
	.msg-list {
		padding: 20rpx;
	}
	
	.msg-box {
		margin: 0 -20rpx;
		padding-bottom: 100rpx;
		
		.title {
			width: 100%;
			padding: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		
		.input-area {
			width: 100%;
			padding: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			
			u-input {
				flex: 1;
			}
			
			/deep/ .u-input {
				background-color: #fafafa;
				border-top-right-radius: 0!important;
				border-bottom-right-radius: 0!important;;
			}
			
			/deep/ button {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
		
		.msg {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 10rpx;
			
			> view {
				padding-left: 20rpx;
				
				.msg-leave {
					height: 30rpx;
				}
				
				.msg-content {
					display: flex;
					align-items: center;
					
					.msg-user-name {
						padding-right: 10rpx;
						color: $u-type-primary-dark;
					}
				}
				
				.msg-time {
					color: $u-tips-color;
				}
			}
						
			.msg-reply {
				width: 100%;
				padding: 10rpx;
				margin-top: 10rpx;
				margin-left: 80rpx;
				border-radius: 6rpx;
				background-color: $u-bg-color;
				
				> view {
					margin-bottom: 10rpx;
				}
			}
		}
	}
</style>
