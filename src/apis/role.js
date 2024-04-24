import service from '@/plugins/request'

export const roleList = (data, params) => service({
  method: "post",
  url: "/wd/role/list",
  data,
  params
})

export const roleSave = (data) => service({
  method: "post",
  url: "/wd/role/save",
  data
})

export const roleDelete = (params) => service({
  method: "get",
  url: "/wd/role/delete",
  params,
})
