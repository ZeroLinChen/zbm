import http from "../http.js"

const api = {
	getClasses: () => http('usersFunctions', 'getClasses'),
	getLists: (data = {}) => http('listsFunctions', 'getLists', data),
	createList: (data, cloudID) => http('listsFunctions', 'createList', data, cloudID),
	getListDetail: (data) => http('listsFunctions', 'getListDetail', data),
	addFollow: (data) => http('usersFunctions', 'addFollow', data),
	getPhoneNumber: (data) => http('usersFunctions', 'getPhoneNum', data),
}

export default api;