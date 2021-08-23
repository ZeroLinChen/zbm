import http from "../http.js"

const api = {
	getClasses: () => http('usersFunctions', 'getClasses'),
}

export default api;