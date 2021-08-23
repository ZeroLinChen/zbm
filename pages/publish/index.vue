<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item label="上传图片" prop="photo" label-width="150">
				<u-upload :beforeUpload="beforeUpload" width="160" height="160"></u-upload>
			</u-form-item>
			<u-form-item label="标题" prop="title" label-width="150">
				<u-input :border="border" placeholder="请输入姓名" v-model="model.name" type="text"></u-input>
			</u-form-item>
			<u-form-item label="简介" prop="intro" label-width="150">
				<u-input type="textarea" :border="border" placeholder="请填写简介" v-model="model.intro" />
			</u-form-item>
			<u-form-item label="物品类型" prop="goodsType" label-width="150">
				<u-input :border="border" type="select" :select-open="selectShow" v-model="model.goodsType" placeholder="请选择物品类型" @click="selectShow = true"></u-input>
			</u-form-item>
			<u-form-item label="交接方式" prop="tradeType" label-width="150">
				<u-radio-group v-model="model.tradeType" @change="radioGroupChange">
					<u-radio shape="square" v-for="(item, index) in tradeTypeList" :key="index" :name="item.name">{{ item.name }}</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="原价" prop="originalCost" label-width="150">
				<u-input :border="border" placeholder="请输入物品原价" v-model="model.originalCost" type="text"></u-input>
			</u-form-item>
			<u-form-item label="想卖" prop="discontCost" label-width="150">
				<u-input :border="border" placeholder="请输入想要卖出的价格" v-model="model.discontCost" type="text"></u-input>
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
		<u-button @click="submit">提交</u-button>
		
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
				<view class="agreement-sub-title">您应确保您通过咸鱼二手小程序提交、发布的全部信息（包括但不限于个人信息、商品信息、言论及所作出的行为等）不包含以下内容，否则平台有权对您的账户进行处理。因此导致第三方用户或咸鱼二手小程序平台损失的，您应承担全部赔偿责任。</br></view>
				<view class="agreement-main-body">					
					<view>（1）违反国家法律法规、破坏国家统一、煽动民族仇恨、民族歧视、破坏民族团结的；</view>
					<view>（2）损害国家机关信誉、进行政治宣传或破坏国家宗教政策的；</view>
					<view>（3）宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖或教唆犯罪的；</view>
					<view>（4）侮辱、诽谤、恐吓、散播涉及他人隐私等侵害他人合法权益的；</view>
					<view>（5）捏造、歪曲或掩盖事实，从事欺诈、虚假、不准确或误导性行为，扰乱社会秩序、平台交易秩序的；</view>
					<view>（6）侵犯他人知识产权或涉及第三方商业秘密及其他专有权利的；</view>
					<view>（7）存在可能破坏、篡改、删除、影响咸鱼二手小程序任何系统正常运行或未经授权秘密获取咸鱼二手小程序及其他用户的数据、个人资料的病毒、木马、爬虫等恶意软件、程序代码的；</view>
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
	</view>
</template>

<script>
	import tabbarSetting from '../../static/tabbarSetting';
	import { utils } from '../../common/utils.js'
	
	export default {
		data() {
			return {
				model: {
					photo: '',
					title: '',
					intro: '',
					tradeType: '自提',
					agreement: false,
					goodsType: '',
					originalCost: 0,
					discontCost: 0
				},
				photo: '',
				tradeTypeList: [
					{
						name: '自提',
						checked: true,
						disabled: false
					},
					{
						name: '邮寄',
						checked: false,
						disabled: false
					}
				],
				selectList: [],
				selectShow: false,
				showAgreement: false,
				rules: {
					name: [
						{
							required: true,
							message: '请输入姓名',
							trigger: 'blur' ,
						},
						{
							min: 3,
							max: 5,
							message: '姓名长度在3到5个字符',
							trigger: ['change','blur'],
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
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
					payType: [
						{
							required: true,
							message: '请选择任意一种支付方式',
							trigger: 'change',
						}
					],
					tradeType: [
						{
							required: true,
							message: '请选择交接方式',
							trigger: 'change',
						}
					],
					goodsType: [
						{
							required: true,
							message: '请选择物品类型',
							trigger: 'change',
						}
					]
				},
				tabbar: tabbarSetting,
			}
		},
		onLoad() {
			this.selectList = getApp().globalData.classList.map((item, index) => {
				return {value: index, label: item}
			})
		},
		methods: {
			beforeUpload(e, list) {
				utils.uploadWxFiles({path: `${e}.png`, url: list[e].url}, (res) => {
					console.log(res.fileID)
				}, (err) => {
					
				})
				return false;
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if(!this.model.agreement) return this.$u.toast('请勾选协议');
						console.log(this.model)
					} else {
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
				this.model.goodsType = '';
				e.map((val, index) => {
					this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
				})
			},
			// 勾选版权协议
			checkboxChange(e) {
				this.model.agreement = e.value;
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
</style>
