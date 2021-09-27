<template>
	<view class="wrap">
		<u-top-tips ref="uTips"></u-top-tips>
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="['message']">
			<u-form-item v-if="!id" label="上传图片" prop="photo" label-width="150">
				<u-upload ref="uUpload" :beforeUpload="beforeUpload" width="160" height="160"></u-upload>
			</u-form-item>
			<u-form-item label="标题" prop="title" label-width="150">
				<u-input placeholder="请输入标题" v-model="model.title" type="text"></u-input>
			</u-form-item>
			<u-form-item label="简介" prop="intro" label-width="150">
				<u-input type="textarea" placeholder="描述你的宝贝,如品牌、规格、成色、购买渠道、转手原因等" v-model="model.intro" />
			</u-form-item>
			<u-form-item label="物品类型" prop="classText" label-width="150">
				<u-input type="select" :select-open="selectShow" v-model="model.classText" placeholder="请选择物品类型" @click="selectShow = true"></u-input>
			</u-form-item>
			<u-form-item label="交接方式" prop="tradeType" label-width="150">
				<u-radio-group v-model="model.tradeType" @change="radioGroupChange">
					<u-radio shape="square" v-for="(item, index) in tradeTypeList" :key="index" :name="item.value">{{ item.name }}</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="原价" prop="originalCost" label-width="150">
				<u-input placeholder="请输入物品原价" v-model="model.originalCost" type="text"></u-input>
			</u-form-item>
			<u-form-item label="想卖" prop="discontCost" label-width="150">
				<u-input placeholder="请输入想要卖出的价格" v-model="model.discontCost" type="text"></u-input>
			</u-form-item>
			<!-- 联系方式组 -->
			<u-divider :half-width="0" :height="100" bg-color="#fafafa" type="info">联系方式</u-divider>
			<u-form-item label="微信号" prop="wx_account" label-width="150">
				<u-input placeholder="请输入微信号" v-model="model.wx_account" type="text"></u-input>
			</u-form-item>
		</u-form>
		<view class="agreement">
			<u-checkbox v-model="model.agreement" @change="checkboxChange"></u-checkbox>
			<view>
				<view class="agreement-text">阅读并同意</view>
				<view class="agreement-tap" @click="showAgreement = true">《周边卖用户发布协议》</view>
				<view class="agreement-text">（滚动至底部关闭）</view>
			</view>
		</view>
		<u-button type="primary" open-type="getPhoneNumber" @getphonenumber="submit">发布</u-button>
		
		<u-popup
			border-radius="10"
			v-model="showAgreement"
			@close="close"
			@open="open"
			:mask-close-able="false"
			mode="center"
			width="90%"
			height="80%"
		>
			<view class="agreement-content">
				<view class="agreement-title">周边卖用户发布协议</view>
				<view class="agreement-sub-title">您应确保您通过周边卖小程序提交、发布的全部信息（包括但不限于个人信息、商品信息、言论及所作出的行为等）不包含以下内容，否则平台有权对您的账户进行处理。因此导致第三方用户或周边卖小程序平台损失的，您应承担全部赔偿责任。</br></view>
				<view class="agreement-main-body">					
					<view>（1）违反国家法律法规、破坏国家统一、煽动民族仇恨、民族歧视、破坏民族团结的；</view>
					<view>（2）损害国家机关信誉、进行政治宣传或破坏国家宗教政策的；</view>
					<view>（3）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖或教唆犯罪的；</view>
					<view>（4）侮辱、诽谤、恐吓、散播涉及他人隐私等侵害他人合法权益的；</view>
					<view>（5）捏造、歪曲或掩盖事实，从事欺诈、虚假、不准确或误导性行为，扰乱社会秩序、平台交易秩序的；</view>
					<view>（6）侵犯他人知识产权或涉及第三方商业秘密及其他专有权利的；</view>
					<view>（7）存在可能破坏、篡改、删除、影响周边卖小程序任何系统正常运行或未经授权秘密获取周边卖小程序及其他用户的数据、个人资料的病毒、木马、爬虫等恶意软件、程序代码的；</view>
					<view>（8）其他违背社会公共利益或公共道德的。</view>
				</view>
				<view class="agreement-sub-title">用户行为规范</view>
				<view class="agreement-main-body">
					<view>（1）不得发布垃圾广告。</view>
					<view>（2）不支持闲置物品描述与实际不符的发布行为。</view>
					<view>（3）不得在发货或者退货时，故意调换闲置商品或偷换零件。</view>
					<view>（4）不得在交易产生后，以牟利或借机进行敲诈勒索为目的的恶意行为，或者进行其他明显违反平等、公平、自愿等交易原则的违法违规行为。</view>
					<view>（5）不得进行骗取他人财务的欺诈行为。</view>
					<view>（6）不得频繁异常地发生交易纠纷导致他人资损。</view>
					<view>（7）不得发布和交易国家法律法规不允许交易或者需要特殊资质方可交易的商品（包括但不限于枪支弹药、香烟、药品等）。</view>
					<view>（8）不得发布成人用品、正在流通和错版人民币。</view>
					<view>（9）不得发布拉人炒信的兼职广告商品信息。</view>
					<view>（10）不得发布假货。</view>
					<view>（11）不得发布存在交易风险的虚拟商品信息。</view>
					<view>（12）不得发布泄露他人隐私的内容。</view>
					<view>（13）不得以侮辱、诽谤等方式对他人进行人身攻击。如您违反国家法律法规规定及以上规则发布和交易禁发禁售商品或存在恶意行为的，平台将无法保障您的权益，且有权对您进行相应处罚，包括但不限于限制账号功能、封禁账号。对于用户存在的涉嫌违法犯罪的行为，平台将移交司法机关进行处理。</view>
				</view>
				
				<view class="close-btn">
					<u-button @click="showAgreement = false;model.agreement = true" size="medium">我已知晓</u-button>
				</view>
			</view>
		</u-popup>
		
		<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
		
		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
		
		<u-mask :show="showLoading" :mask-click-able="false">
			<view class="flex-center">
				<u-loading :show="true"></u-loading>
			</view>
		</u-mask>
		
		<u-modal v-model="uploadComplate" :show-title="false" content="发布完成，返回首页" @confirm="uploadComplateFn"></u-modal>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import tabbarSetting from '../../static/tabbarSetting';
	import api from '../../common/server/api/index.js'
	import { utils } from '../../common/utils.js'
	
	export default {
		data() {
			return {
				model: {
					photo: [],
					title: '',
					intro: '',
					tradeType: 0,
					agreement: false,
					class: '',
					classText: '',
					originalCost: 0,
					discontCost: 0,
					wx_account: ''
				},
				photo: [],
				photoList: [], // 缓存返回的临时图片地址
				tradeTypeList: [
					{
						name: '自提',
						value: 0,
						checked: true,
						disabled: false
					},
					{
						name: '邮寄',
						value: 1,
						checked: false,
						disabled: false
					}
				],
				selectList: [],
				selectShow: false,
				showAgreement: false,
				rules: {
					photo: [
						{
							required: true,
							message: '请上传最少一张图片',
						}
					],
					title: [
						{
							required: true,
							message: '请输入标题',
							trigger: 'blur' ,
						},
						{
							min: 3,
							max: 15,
							message: '标题长度在3到15个字符',
							trigger: ['change','blur'],
						},
					],
					intro: [
						{
							required: true,
							message: '请填写简介'
						},
						{
							min: 5,
							message: '简介不能少于5个字',
							trigger: 'change' ,
						},
					],
					classText: [
						{
							required: true,
							message: '请选择物品类型',
							trigger: 'change',
						}
					],
					discontCost: [
						{
							required: true,
							message: '请填写价格',
							trigger: 'change',
						}
					],
					wx_account: [
						{
							required: true,
							message: '请填写微信账号',
							trigger: 'change',
						}
					]
				},
				tabbar: tabbarSetting,
				showLoading: false,
				uploadComplate: false,
				id: '',
			}
		},
		onLoad(option) {
			this.id = option.id
			this.selectList = getApp().globalData.classList.map((item, index) => {
				return {value: index, label: item.name}
			})
			if (option.id) {
				this.getListDetail(option)
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			this.$refs.uTips.show({
				title: '暂不支持图片修改，如需修改图片，请重新发布',
				type: 'error',
				duration: '2300'
			})
		},
		methods: {
			beforeUpload(e, list) {
				this.showLoading = true;
				utils.uploadWxFiles({path: `userFiles/${this.$u.guid(20)}.png`, url: list[e].url}, (res) => {
					this.model.photo.push(res.fileID)
					this.showLoading = false;
				}, (err) => {
					this.showLoading = false;
				})
				return false;
			},
			submit(e) {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if(!this.model.agreement) return this.$u.toast('请勾选协议');
						// console.log(this.model)
						
						this.createList(this.model, wx.cloud.CloudID(e.detail.cloudID));
					} else {
						console.log(this.model)
						console.log('验证失败');
					}
				});
			},
			// radio选择发生变化
			radioGroupChange(e) {
				this.model.tradeType = e;
			},
			// 选择商品类型回调
			selectConfirm(e) {
				this.classText = '';
				e.map((val, index) => {
					this.model.classText = val.label;
					this.model.class = val.value;
				})
			},
			// 勾选版权协议
			checkboxChange(e) {
				this.model.agreement = e.value;
			},
			getPhoneNum(e) {
				api.getPhoneNum(e.detail.cloudID).then(res => {
					console.log(res)
				}).catch(e => {
					console.log(e)
				})
			},
			createList(data, cloudID) { // 上传接口
				data = { ...data }
				
				data.id = data._id; // 云开发接口不允许存在_id字段
				delete data._id;
				
				this.showLoading = true;
				delete data.classText
				delete data.agreement
				api.createList(data, cloudID).then((res) => {
					this.showLoading = false;
					if (res.success) {
						this.uploadComplate = true;
					} else {
						his.showToast(res.errorMsg, 'error')
					}
				}).catch((e) => {
					this.showLoading = false;
					this.showToast(e, 'error')
				})
			},
			getListDetail(id) {
				this.showLoading = true
				api.getListDetail(id)
					.then(async (res) => {
						Object.assign(this.model, res.data.data)
						this.selectConfirm([this.selectList[res.data.data.class]]) // 返回值不存在classText，手动触发select回调
						// this.model = res.data.data
						// this.photoList = await this.getImg(this.info.photo)
						// this.photoList.forEach(item => {
						// 	this.$refs.uUpload.lists.url = item
						// })
						// files = this.$refs.uUpload.lists.;
					})
					.catch(e => {
						
					})
					.finally(() => {
						this.showLoading = false
					})
			},
			async getImg(url) {
				const res = await utils.getWxImg(url);
				return res;
			},
			uploadComplateFn() {
				uni.switchTab({
					url: '../index/index',
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

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
	padding-bottom: 50rpx;
}

.agreement {
	display: flex;
	align-items: center;
	margin: 40rpx 0;

	.agreement-text {
		display: inline;
		padding-left: 8rpx;
		color: $u-tips-color;
	}
	
	.agreement-tap {
		display: inline;
		color: $u-type-primary;
	}
}

.agreement-content {
	padding: 25rpx;
	
	.agreement-title {
		padding-bottom: 20rpx;
		font-size: 34rpx;
		font-weight: bold;
		text-align: center;
	}
	
	.agreement-sub-title {
		padding-bottom: 10rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.agreement-main-body *{
		text-indent: 2em;
	}
	
	.close-btn {
		margin-top: 20rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.flex-center{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
</style>
