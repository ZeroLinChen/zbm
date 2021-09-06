<template>
	<view class="content">
		<u-sticky bgColor="#f2f2f2">
			<u-search v-model="value" @search="search" :clearabled="true" :show-action="false" shape="0"></u-search>
			<!-- <u-subsection :bold="true" :active-color="subActiveColor" :list="classList" :borderRadius="0" @change="subChange"></u-subsection> -->
			<u-tabs ref="tabs" :current="currentTab" :list="classList"  @change="tabChange"></u-tabs>
		</u-sticky>
		<view class="wrap">
			<view class="lists-box">
				<view class="demo-warter" v-for="(item, index) in flowList" :key="index" @click="showDetail(item._id)">
					<u-lazy-load threshold="-450" height="300" loading-img="/static/img/bitmap.png" img-mode="aspectFill" border-radius="10" :image="imgList[index]" :index="index"></u-lazy-load>
					<view class="demo-title">{{ item.title }}</view>
					<view class="demo-price">{{ item.discontCost }}元</view>
<!-- 					<view class="demo-tag">
						<view class="demo-tag-owner">自营</view>
						<view class="demo-tag-text">放心购</view>
					</view> -->
					<view class="demo-shop">
						<u-avatar 
							mode="circle" 
							size="30" 
							:src="item.zbm_avatarUrl"
							bgColor='#fcbd71'
						></u-avatar>
						<view class="shop-name">{{ item.zbm_nickName }}</view>
					</view>
					<!-- <view class="u-close">
						<u-icon name="close-circle-fill" color="#fa3534" size="34" @click="remove(item.id)"></u-icon>
					</view> -->
				</view>
			</view>
			<u-loadmore :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</view>
		
		<u-tabbar :list="tabbar" :mid-button="true" iconSize="48"></u-tabbar>
		
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
				skipStep: 10,
				skipNumber: 0,
				loadStatus: 'loadmore',
				classList: [{name: '全部'}],
				flowList: [],
				imgList: [], // 微信小程序云开发不能直接获取图片，需要额外数组保存
				subActiveColor: this.$u.color['primary'],
				tabbar: tabbarSetting,
				currentTab: 0,
				currentRules: { // 保存当前规则，当变化时清空列表及初始化skipNumber
					class: '',
					keyword: '',
				},
				userInfo: {},
				loginPopup: false,
			};
		},
		onLoad() {
			const id = uni.getStorageSync('userInfo')
			if (id) {
				this.createUser()
			} else {
				this.loginPopup = true
			}
			this.skipNumber -= this.skipStep;
			// console.log(this.skipNumber)
			this.getClasses();
			this.getLists();
		},
		onReachBottom() {
			if (this.loadStatus === 'nomore') return
			this.loadStatus = 'loading';
			this.getLists(this.currentRules);
		},
		methods: {
			getClasses() { // 获取分类数据
				api.getClasses().then((res) => {
					const o_list = this.classList;
					const list = res.data.data.map(item => {return {name: item.label}});
					getApp().globalData.classList = list;
					this.classList = this.classList.concat(list);
					console.log(this.classList)
				}).catch((e) => {
					this.showToast(e, 'error')
				})
			},
			getLists(data = {}) { // 获取物品列表数据
				let reset = false;
				['class', 'keyword'].forEach(item => { // 当数组中的两个字段改变时，清空列表
					if (data[item] !== this.currentRules[item]) {
						this.skipNumber = 0 - this.skipStep;
						this.flowList = [];
						this.imgList = [];
					}
				})
			
				this.skipNumber = this.skipNumber + this.skipStep;
				Object.assign(data, { skip: this.skipNumber})
				api.getLists(data).then((res) => {
					this.flowList.push(...res.data.data);
					this.getImg(res.data.data.map(item => item.firstImg)).then(imgList => {
						this.imgList.push(...imgList);
					});
					
					(res.data.data.length === 0 || (res.data.data.length < this.skipStep)) 
						? (this.loadStatus = 'nomore') 
						: (this.loadStatus = 'loading');
				}).catch((e) => {
					this.showToast(e, 'error')
				})
			},
			async getImg(url) {
				const res = await utils.getWxImg(url);
				return res;
			},
			showToast(msg, type, back = false, url = '') {
				this.$refs.uToast.show({
					title: msg,
					type: type,
				})
			},
			tabChange(e) {
				this.currentTab = e;
				this.getLists({ class: e - 1 });
			},
			search(value) {
				this.getLists({ keyword: value, class: this.currentTab - 1});
			},
			showDetail(id) {
				uni.navigateTo({
					url: `../detail/index?id=${id}`
				})
			},
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.wrap {
		width: 750rpx;
	}
	
	.lists-box {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.demo-warter {
		width: calc(50% - 20rpx);
		border-radius: 8px;
		margin: 10rpx;
		background-color: #ffffff;
		padding: 8rpx;
		position: relative;
		box-sizing: border-box;
	}
	
	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}
	
	.demo-image {
		width: 100%;
		border-radius: 4px;
	}
	
	.demo-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
		word-break: break-all;
	}
	
	.demo-tag {
		display: flex;
		margin-top: 5px;
	}
	
	.demo-tag-owner {
		background-color: $u-type-error;
		color: #ffffff;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}
	
	.demo-tag-text {
		border: 1px solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}
	
	.demo-price {
		font-size: 30rpx;
		color: $u-type-error;
		margin-top: 5px;
	}
	
	.demo-shop {
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
		display: flex;
	}
	
	.shop-name {
		margin-left: 5rpx;
	}
	
	u-sticky {
		width: 750rpx;
	}
	
	.loginBtn {
		padding: 100rpx 120rpx;
	}
</style>
