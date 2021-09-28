<template>
	<view class="wrap">
		<view class="lists-box">
			<view class="demo-warter" v-for="(item, index) in flowList" :key="index" @click="showDetail(item._id)">
				<u-lazy-load v-if="item.status === 1" threshold="-450" height="300" loading-img="/static/img/bitmap.png" img-mode="aspectFill" border-radius="10" :image="imgList[index]" :index="index"></u-lazy-load>
				<u-empty v-else-if="item.status === 2" text="已下架" mode="order"></u-empty>
				<u-empty v-else text="已关闭" mode="page"></u-empty>
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
				userInfo: {},
				skipStep: 10,
				skipNumber: 0,
				loadStatus: 'loadmore',
				flowList: [],
				imgList: [], // 微信小程序云开发不能直接获取图片，需要额外数组保存
				option: {},
			}
		},
		onLoad(option) {
			this.option = option
			if (option.userId) {
				this.userInfo._id = option.userId
			} else {
				this.userInfo = uni.getStorageSync('userInfo')
			}
			this.skipNumber -= this.skipStep // 初始化分页字段
			this.getLists({creatorId: this.userInfo._id, status: -1})
		},
		onReady() {
			uni.setNavigationBarTitle({
			    title: `${this.option.name}的发布`
			});
		},
		onReachBottom() {
			if (this.loadStatus === 'nomore') return
			this.loadStatus = 'loading';
			this.getLists({creatorId: this.userInfo._id, status: -1});
		},
		methods: {
			getLists(data = {}) { // 获取物品列表数据
				this.skipNumber += this.skipStep;
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
			showDetail(id) {
				uni.navigateTo({
					url: `../detail/index?id=${id}`
				})
			},
			backHome() {
				uni.switchTab({
					url: '../index/index',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	
	/deep/ .u-empty {
		height: 300rpx!important;
		background-color: rgba($color: $u-type-info-disabled, $alpha: .6);
	}
</style>
