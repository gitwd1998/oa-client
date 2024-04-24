import service from '@/plugins/request'

export const menuList = (data, params) => service({
  method: "post",
  url: "/wd/menu/list",
  data,
  params
})

export const menuTree = () => service({
  method: "get",
  url: "/wd/menu/tree"
})

export const menuSave = (data) => service({
  method: "post",
  url: "/wd/menu/save",
  data
})

export const menuDelete = (params) => service({
  method: "get",
  url: "/wd/menu/delete",
  params,
})
