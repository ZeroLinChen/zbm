<template>
	<view class="content">
		<!-- 欢迎页 -->
		<view class="welcome" v-if="welcome">
			<view style="width: 100%; padding: 0 120rpx; margin-top: -50rpx;">
				<p>欢迎来到</p>
				<p style="text-align: right;">周边卖</p>
			</view>
		</view>
		<!-- 欢迎页 end -->
		<u-sticky bgColor="#f2f2f2">
			<u-search v-model="value" @search="search" :clearabled="true" :show-action="false" shape="0"></u-search>
			<!-- <u-subsection :bold="true" :active-color="subActiveColor" :list="classList" :borderRadius="0" @change="subChange"></u-subsection> -->
			<view class="flex">
				<u-tabs class="u-tabs" ref="tabs" :current="currentTab" :list="classList"  @change="tabChange"></u-tabs>
				<u-line class="u-line" color="gray" direction="col" length="44" />
				<u-dropdown class="u-dropdown" :height="88" :border-radius="8" title-size="12px">
					<u-dropdown-item v-model="zone" :title="zone ? zoneList.find(item => item.value === zone).label : '区域选择'" :options="zoneList" @change="getLists({})"></u-dropdown-item>
				</u-dropdown>
			</view>
		</u-sticky>
		<view class="wrap">
			<view class="lists-box">
				<view class="demo-warter" v-for="(item, index) in flowList" :key="index" @click="showDetail(item._id)">
					<u-tag class="u-tag" v-if="item.setTop" text="置 顶" mode="dark" />
					<u-lazy-load threshold="-450" height="300" loading-img="/static/img/bitmap.png" img-mode="aspectFill" border-radius="10" :image="imgList[index]" :index="index"></u-lazy-load>
					<view class="demo-title">{{ item.title }}</view>
					<view class="demo-price">
						{{ item.discontCost }}元
					</view>
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
						<u-tag
							v-if="!utils.isNullObj(item.zone)"
							style="margin-left: auto;"
							size="mini"
							:text="`${item.zone.area.label}${item.zone.street && item.zone.street.label}`"
						/>
					</view>
					<!-- <view class="u-close">
						<u-icon name="close-circle-fill" color="#fa3534" size="34" @click="remove(item.id)"></u-icon>
					</view> -->
				</view>
			</view>
			<u-loadmore :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</view>
		
		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
		
		<u-toast ref="uToast" />
		
		<login-component v-model="loginPopup" @login-call-back="createUser" />
	</view>
</template>

<script>
	import loginComponent from '../../components/loginComponent.vue'
	import tabbarSetting from '../../static/tabbarSetting';
	import api from '../../common/server/api/index.js'
	import { utils } from '../../common/utils.js'
	
	export default {
		components: {
			loginComponent,
		},
		data() {
			return {
				welcome: true,
				fristInit: true, // 判断首次加载
				utils: utils,
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
				zoneList: [
					{
						label: '全部',
						value: '',
					},
					{
						label: '沙琅镇',
						value: '440904117',
					},
					{
						label: '观珠镇',
						value: '440904116',
					},
					{
						label: '那霍镇',
						value: '440904121',
					},
					{
						label: '望夫镇',
						value: '440904119',
					},
					{
						label: '罗坑镇',
						value: '440904120',
					},
					{
						label: '黄岭镇',
						value: '440904118',
					},
					{
						label: '霞洞镇',
						value: '440904115',
					},
				],
				zone: ''
			};
		},
		created() {
			console.time('created')
			this.getLists();
			const id = uni.getStorageSync('userInfo')
			if (id) {
				this.createUser()
			} else {
				// this.loginPopup = true
			}
			this.skipNumber -= this.skipStep;
			// console.log(this.skipNumber)
			this.getClasses();
		},
		mounted() {
			setTimeout(() => {
				this.welcome = false;
			}, 2300)
		},
		onShow() {
			console.time('show')
			this.fristInit || this.getLists();
			this.fristInit = false;
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
					// console.log(this.classList)
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
				
				if (this.zone) {
					Object.assign(data, { zone: this.zone})
				}
				console.time('api')
				api.getLists(data).then((res) => {
					this.flowList.push(...res.data.data);
					this.getImg(res.data.data.map(item => item.firstImg)).then(imgList => {
						this.imgList.push(...imgList);
					});
					
					(res.data.data.length === 0 || (res.data.data.length < this.skipStep)) 
						? (this.loadStatus = 'nomore') 
						: (this.loadStatus = 'loading');
					console.timeEnd('inter')
					console.timeEnd('app show')
					console.timeEnd('created')
					console.timeEnd('show')
					console.timeEnd('api')
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
				const userInfo = uni.getStorageSync('userInfo')
				if (!userInfo) {
					this.showToast('点击登录按钮使用完整功能', 'warning')
					this.loginPopup = true
					return
				}
				
				uni.navigateTo({
					url: `../detail/index?id=${id}`
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
	
	.flex {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		
		.u-tabs {
			width: calc(100vw - 180rpx);
		}
		
		.u-line {
			flex: unset;
			padding-left: 20rpx;
		}
		
		.u-dropdown {
			width: 160rpx;
			padding-bottom: 6rpx;
			
			/deep/ .u-dropdown__content__mask, /deep/ .uicon-checkbox-mark {
				display: none;
			}
			
			/deep/ .u-dropdown__menu__item__text {
				color: $u-type-primary!important;
			}
			
			/deep/ .u-cell_title {
				font-size: 24rpx;
			}
		}
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
		
		.u-tag {
			position: absolute;
			top: 10rpx;
			left: 10rpx;
			z-index: 10;
		}
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
	
	.welcome {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-image: linear-gradient(120deg, rgba($color: $u-type-primary, $alpha: 0) 0%, rgba($color: $u-type-primary, $alpha: 1) 100%);
		background-color: #FFFFFF;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		z-index: 10000;
		
		p {
			font-family: Helvetica;
			margin: 0;
			padding: 0;
			font-size: 96rpx;
			color: #fff;
			letter-spacing: -.6rpx;
			font-weight: bolder;
			
			background-image: linear-gradient(75deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 33.33%, rgba(255, 255, 255, 0) 66.67%, rgba(255, 255, 255, 0) 100%);
			background-size: 300% 100%;
			background-position-x: 100%;
			
			background-clip: text;
			color: transparent;
			
			// transition: 2s background-position-x ease-in-out;
		}
		
		p:first-child {
			animation: welcome 2s ease-in-out infinite alternate;
			animation-fill-mode: forwards;
		}
		p:last-child {
			animation: welcome 2s ease-in-out 1s;
			animation-fill-mode: forwards;
		}
		
		// p:hover {
		// 	background-position-x: 0%;
		// }
	}
	
	@keyframes welcome {
	  from {background-position-x: 100%;}
	  to {background-position-x: 0%;}
	}
</style>
