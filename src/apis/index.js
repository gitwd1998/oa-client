import service from '@/plugins/request'

export const captcha = () => service.get('/wd/captcha', {
  responseType: 'blob'
})