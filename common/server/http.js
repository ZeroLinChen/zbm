const maxTime = 10; // 请求最大等待时间（秒）

wx.cloud.init()
function http(api, method, data = {}) {
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
				}
			}).then((resp) => {
				res(resp.result)
			})
		}catch(e){
			rej(e)
		}
	})
	return res;
}

export default http;