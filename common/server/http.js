const maxTime = 10; // 请求最大等待时间（秒）

wx.cloud.init()
// cloudID获取微信小程序开放数据
function http(api, method, data = {}, cloudID) {
	let res = new Promise((res, rej) => {
		try{
			setTimeout(() => {
				rej('请求超时');
			}, maxTime * 1000);
			wx.cloud.callFunction({
				name: api,
				data: {
					type: method,
					data,
					cloudData: cloudID ? cloudID : '',
				},
			}).then((resp) => {
				if (resp.result.success) {
					res(resp.result)
				} else {
					rej(resp.result.errMsg)
				}
			})
		}catch(e){
			rej(e)
		}
	})
	return res;
}

export default http;