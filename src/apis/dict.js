import service from '@/plugins/request'

export const dictList = (data, params) => service({
  method: "post",
  url: "/wd/dict/list",
  data,
  params
})

export const dictSave = (data) => service({
  method: "post",
  url: "/wd/dict/save",
  data
})

export const dictDelete = (params) => service({
  method: "get",
  url: "/wd/dict/delete",
  params,
})

export const dictOptionList = (data) => service({
  method: "post",
  url: "/wd/dict/option/list",
  data
})

export const dictOptionBatch = (data) => service({
  method: "post",
  url: "/wd/dict/option/batch",
  data
})

export const dictOptionDelete = (params) => service({
  method: "get",
  url: "/wd/dict/option/delete",
  params,
})








export const shopTypeList = (data) => service({
  method: "post",
  url: "/wd/shopType/list",
  data
})

export const shopList = (data) => service({
  method: "post",
  url: "/wd/shop/list",
  data
})