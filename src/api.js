import axios from 'axios'

const api = axios.create({
  baseURL: 'https://myseu.cn/yxlserv/',
  validateStatus: s => true
})

api.interceptors.response.use(res => {
  if (res.status >= 400) {
    if (typeof res.data === 'string') {
      alert(res.data)
    }
    window.location.reload()
    throw new Error(res.data)
  }
  return res;
})

export default api
