<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-20">
				<u-avatar :src="userInfo.zbm_avatarUrl" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-10">{{userInfo.zbm_nickName}}</view>
				<view class="u-font-12">
					<u-tag
						:text="userInfo.zone ? `${userInfo.zone.province.label}${userInfo.zone.city.label}${userInfo.zone.area.label}${userInfo.zone.street && userInfo.zone.street.label}` : '点击此处完善地区信息'"
						:type="userInfo.zone ? 'success' : 'error'"
						@click="openZoneSelecter"
					/>
				</view>
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
				<u-cell-item icon="plus" title="我的发布" @click="showDetail('myPost')"></u-cell-item>
				<u-cell-item icon="heart" title="我的关注" @click="showDetail('myFollow')"></u-cell-item>
				<u-cell-item icon="bell" title="置顶时长">
					可用时长: 
					<span class="setTopTime">
						<u-count-to 
							ref="conutNum"
							:start-val="countStart"
							:end-val="countEnd"
							:color="countFontColor"
							:bold="true"
							:autoplay="false"
							:duration="1000"
						/>
					</span>分钟
					<u-button solt="right-icon" type="primary" size="mini" :ripple="true" @click.stop="recharge">充值</u-button>
				</u-cell-item>
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
		
		<u-modal v-model="showModal" :show-title="false" :negative-top="300" confirm-text="取消">
			<view class="rechargeOption">
				<view class="remaining">
					我的剩余时长：<span class="setTopTime">{{userInfo.setTopTime}}</span>分钟
				</view>
				
				<u-grid :col="2">
					<u-grid-item @click="goPay(100)">
						<view class="totalFee">充1元</view>
						<view class="totalTime">120分钟(2小时)</view>
					</u-grid-item>
					<u-grid-item @click="goPay(1000)">
						<view class="totalFee">充10元</view>
						<view class="totalTime">1440分钟(24小时)</view>
					</u-grid-item>
					<u-grid-item @click="goPay(5000)">
						<view class="totalFee">充50元</view>
						<view class="totalTime">8640分钟(144小时)</view>
					</u-grid-item>
					<u-grid-item @click="goPay(10000)">
						<view class="totalFee">充100元</view>
						<view class="totalTime">18720分钟(312小时)</view>
					</u-grid-item>
				</u-grid>
			</view>
		</u-modal>
		
		<city-select v-model="userZone" title-text="请先完善个人地区信息" :defaultRegion="userInfo.zone || []" @city-change="cityChange"></city-select>
		
		<u-mask :show="showLoading" :mask-click-able="false" z-index="99999">
			<view class="flex-center">
				<u-loading :show="true"></u-loading>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import citySelect from '../../components/u-city-select.vue';
	
	import tabbarSetting from '../../static/tabbarSetting';
	import api from '../../common/server/api/index.js'
	import { utils } from '../../common/utils.js'
	
	export default {
		components: {
			citySelect
		},
		data() {
			return {
				userInfo: {},
				tabbar: tabbarSetting,
				showModal: false,
				countFontColor: this.$u.color['primary'],
				countStart: 0,
				countEnd: 0,
				userZone: false,
				showLoading: false,
			}
		},
		watch: {
			userInfo(nv, ov) {
				this.countStart = ov.setTopTime;
				this.countEnd = nv.setTopTime;
				this.$refs.conutNum.start();
			},
		},
		onShow() {
			const id = uni.getStorageSync('userInfo')
			if (id) {
				this.createUser()
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
						that.createUser(res.userInfo)
				    },
				    fail() {
						that.showToast("获取用户信息失败！", 'error')
				    }
				})
			},
			createUser(data) {
				this.showLoading = true;
				api.createUser(data).then(res => {
					if (res.success) {
						this.loginPopup = false
						this.userInfo = Object.assign({}, res.data.data)
						this.userZone = !!!this.userInfo.zone
						uni.setStorageSync('userInfo', res.data.data)
					} else {
						this.showToast("获取用户信息失败！", 'error')
					}
				}).catch(err => {
					this.showToast("获取用户信息失败！", 'error')
					this.loginPopup = true
				}).finally(() => {
					this.showLoading = false
				})
			},
			openZoneSelecter() {
				this.userZone = true;
			},
			cityChange(zoneData) {
				api.editZone(zoneData).then(res => {
					if (res.success) {
						this.userInfo = Object.assign(this.userInfo, {zone: zoneData})
						this.$forceUpdate()
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
			recharge() {
				this.showModal = true;
			},
			goPay(totalFee) {
				this.showLoading = true
				api.goPay({
					body: `购买置顶时长${totalFee/100}元`,
					totalFee
				})
				.then(res => {
					const payment = res.payment
					wx.requestPayment({
						...payment,
					})
					.then(res2 => {
						console.log(res2)
						this.$u.toast('支付成功！');
						this.createUser();
					})
					.catch(err2 => {
						console.log(err2)
						this.$u.toast('支付失败，请重试');
					})
					.finally(() => {
						this.showModal = false;
						this.showLoading = false;
					})
				})
			},
			showToast(msg, type, back = false, url = '') {
				this.$refs.uToast.show({
					title: msg,
					type: type,
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

u-button {
	margin: 0 30rpx;
}

.setTopTime {
	padding: 10rpx;
	color: $u-type-primary;
}

.remaining {
	padding: 20rpx;
	color: $u-tips-color;
}

.totalFee {
	font-size: 36rpx;
	font-weight: bold;
}

.totalTime {
	padding-top: 10rpx;
	font-size: 24rpx;
	color: $u-type-warning;
}

.flex-center{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
</style>
<style>
	page{
		background-color: #ededed;
	}
</style>
