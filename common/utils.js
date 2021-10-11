export default class Utils {
	// 获取微信小程序云开发图片
	getWxImg(url) {
		return new Promise((resolve, reject) => {
			const o_url = url;
			if (typeof url === 'string') {
				url = [url]
			}
			
			wx.cloud.getTempFileURL({
			  fileList: url,
			  success: res => {
			    // fileList 是一个有如下结构的对象数组
			    // [{
			    //    fileID: 'cloud://xxx.png', // 文件 ID
			    //    tempFileURL: '', // 临时文件网络链接
			    //    maxAge: 120 * 60 * 1000, // 有效期
			    // }]
				if (typeof o_url === 'string') {
					resolve(res.fileList[0].tempFileURL)
				} else {
					resolve(res.fileList.map(item => item.tempFileURL))
				}
			  },
			  fail: e => {
				  reject(e)
			  }
			})
		})
	}
	
	// 微信小程序云开发图片上传
	uploadWxFiles({path, url}, success, fail) {
		wx.cloud.uploadFile({
		  cloudPath: path,
		  filePath: url, // 文件路径
		  success: res => {
		    // get resource ID
		    success.call(null, res)
		  },
		  fail: err => {
		    fail.call(null, err)
		  }
		})
	}
	
	// 微信小程序获取订阅授权（一次性）
	wxGetSubscribeAuthorize(tmplIds) {
		return new Promise((resolve, reject) => {
			wx.requestSubscribeMessage({tmplIds})
				.then(res => {
					resolve(res)
				}).catch(err => {
					reject(err)
				})
		})
	}
	
	transfTradeType(num) {
		if (num === 0) {
			return '自提'
		}
		
		if (num === 1) {
			return '邮寄'
		}
		
		if (num === 2) {
			return '送货'
		}
	}
	
	transfStatus(num) {
		const dict = ['关闭', '上架', '下架']
		return dict[num]
	}
	
	// 判断是否空对象
	isNullObj(obj) {
		if (typeof obj !== 'object') {
			throw new Error('参数不是对象')
		}
		
		if (Object.keys(obj).length === 0) {
			return true
		} else {
			return false
		}
	}
	
	backToIndex() {
		uni.switchTab({
			url: '../index/index',
		})
	}
}

export const utils = new Utils();