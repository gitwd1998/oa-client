import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/',
  timeout: 60000
})

service.interceptors.request.use(
  (request) => {
    const Authorization = localStorage.getItem('Authorization') || ''
    if (!Authorization) router.replace('/login')
    request.headers['Authorization'] = Authorization
    // request.headers['Current-Url'] = location.href
    // request.headers['If-Modified-Since'] = '0'
    // request.headers['Cache-Control'] = 'no-cache'
    return Promise.resolve(request)
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    if (response.data.code === '000000' || response.data.size) {
      // empty
    } else {
      ElMessage.error(response.data.message || '系统异常')
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    if (error.response.status === 401) {
      router.replace({
        path: '/login',
        query: {
          redirect: encodeURIComponent(location.href)
        }
      })
    } else {
      ElMessage.error(error || '系统异常')
    }
    return Promise.reject(error)
  }
)

export default service