export default class Utils {
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
}

export const utils = new Utils();