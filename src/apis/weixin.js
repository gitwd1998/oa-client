import service from '@/plugins/request'

export const queryMediaList = (data) => service({
  method: "post",
  url: "/wd/weixin/queryMediaList",
  data
})

export const uploadMedia = (data, params) => service({
  method: "post",
  url: "/wd/weixin/uploadMedia",
  headers: {
    "Content-Type": "multipart/form-data"
  },
  data,
  params
})
