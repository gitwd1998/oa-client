import service from '@/plugins/request'

export const userLogin = (data) => service({
  method: "post",
  url: "/wd/user/login",
  data
})

export const userList = (data, params) => service({
  method: "post",
  url: "/wd/user/list",
  data,
  params
})

export const userSave = (data) => service({
  method: "post",
  url: "/wd/user/save",
  data
})

export const userDelete = (params) => service({
  method: "get",
  url: "/wd/user/delete",
  params,
})