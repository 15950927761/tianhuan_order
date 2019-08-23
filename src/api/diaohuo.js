import request from '@/utils/request'

export function addOutbound(data) {
  return request({
    url: '/admin/Diaohuo/addDiaohuo',
    method: 'post',
    data: data
  })
}
export function fetchOutboundList(data) {
  return request({
    url: '/admin/Diaohuo/fetchDiaohuoList',
    method: 'post',
    data: data
  })
}
export function getStockList(diaohuo_id) {
  return request({
    url: '/admin/Diaohuo/getStockList',
    method: 'post',
    data: {
      diaohuo_id
    }
  })
}
export function getBillInfo(diaohuo_id) {
  return request({
    url: '/admin/Diaohuo/getBillInfo',
    method: 'post',
    data: {
      diaohuo_id
    }
  })
}
export function editItemFind(data) {
  return request({
    url: '/admin/Diaohuo/editItemFind',
    method: 'post',
    data: data
  })
}
export function setPickingStatus(diaohuo_id, picker_id, memo) {
  return request({
    url: '/admin/Diaohuo/setPickingStatus',
    method: 'post',
    data: {
      diaohuo_id,
      picker_id,
      memo
    }
  })
}
export function setDeliveryStatus(diaohuo_id, delivery_id, memo) {
  return request({
    url: '/admin/Diaohuo/setDeliveryStatus',
    method: 'post',
    data: {
      diaohuo_id,
      delivery_id,
      memo
    }
  })
}
export function deleteOutboundStock(data) {
  return request({
    url: '/admin/Diaohuo/deleteDiaohuoStock',
    method: 'post',
    data: data
  })
}
export function deleteOutbount(data, memo, diaohuo_id) {
  return request({
    url: '/admin/Diaohuo/deleteDiaohuo',
    method: 'post',
    data: {
      data,
      memo,
      diaohuo_id
    }
  })
}
export function outboundOk(data, arr) {
  return request({
    url: '/admin/Diaohuo/diaohuoOk',
    method: 'post',
    data: {
      data,
      arr
    }
  })
}
export function abnormalOutbound(data) {
  return request({
    url: '/admin/Diaohuo/abnormalDiaohuo',
    method: 'post',
    data: data
  })
}
//  列表异常挂起
export function setAbnormal(id) {
  return request({
    url: '/admin/Diaohuo/setAbnormal',
    method: 'post',
    data: {
      id
    }
  })
}
// 临时修改时间
export function setCoutboundTime(data) {
  return request({
    url: '/admin/Diaohuo/setDiaohuoTime',
    method: 'post',
    data: data
  })
}
// 私库出库打印修改信息
export function setPrivateLodopStatus(data) {
  return request({
    url: '/admin/Diaohuo/setPrivateLodopStatus',
    method: 'post',
    data: data
  })
}
// 获取该商户下的私有仓库
export function getStoreWare(store_id) {
  return request({
    url: '/admin/Diaohuo/getStoreWare',
    method: 'post',
    data: {
      store_id
    }
  })
}
// 获取单据下库存物料
export function getTypeItemList(diaohuo_id) {
  return request({
    url: '/admin/Diaohuo/getTypeItemList',
    method: 'post',
    data: {
      diaohuo_id
    }
  })
}

