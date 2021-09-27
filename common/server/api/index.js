import http from "../http.js"

const api = {
	createUser: (data) => http('usersFunctions', 'createUser', data),
	getClasses: () => http('usersFunctions', 'getClasses'),
	getLists: (data = {}) => http('listsFunctions', 'getLists', data),
	createList: (data, cloudID) => http('listsFunctions', 'createList', data, cloudID),
	getListDetail: (data) => http('listsFunctions', 'getListDetail', data),
	addFollow: (data) => http('usersFunctions', 'addFollow', data),
	removeFollow: (data) => http('usersFunctions', 'removeFollow', data),
	getPhoneNumber: (data) => http('usersFunctions', 'getPhoneNum', data),
	changeStatus: (data) => http('listsFunctions', 'changeStatus', data),
	sendMsg: (data) => http('listsFunctions', 'leaveMsg', data),
	setTop: (data) => http('listsFunctions', 'setTop', data),
	removeTop: (data) => http('listsFunctions', 'removeTop', data),
	goPay: (data) => http('wxPay', '', data),
	editZone: (data) => http('usersFunctions', 'editZone', data),
}

export default api;