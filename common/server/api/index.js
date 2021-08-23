import http from "../http.js"

const api = {
	getClasses: () => http('usersFunctions', 'getClasses'),
	getLists: (data = {}) => http('listsFunctions', 'getLists', data),
}

export default api;