import request from '@/utils/request'

export function addOutbound(data) {
  return request({
    url: '/admin/Outbound/addoutbound',
    method: 'post',
    data: data
  })
}
export function fetchOutboundList(data) {
  return request({
    url: '/admin/Outbound/fetchOutboundList',
    method: 'post',
    data: data
  })
}
export function getStockList(outbound_id) {
  return request({
    url: '/admin/Outbound/getStockList',
    method: 'post',
    data: {
      outbound_id
    }
  })
}
export function getBillInfo(outbound_id) {
  return request({
    url: '/admin/Outbound/getBillInfo',
    method: 'post',
    data: {
      outbound_id
    }
  })
}
export function editItemFind(data) {
  return request({
    url: '/admin/Outbound/editItemFind',
    method: 'post',
    data: data
  })
}
export function setOutboundStatus(outbound_id) {
  return request({
    url: '/admin/Outbound/setOutboundStatus',
    method: 'post',
    data: {
      outbound_id
    }
  })
}
export function setPickingStatus(outbound_id, picker_id, memo) {
  return request({
    url: '/admin/Outbound/setPickingStatus',
    method: 'post',
    data: {
      outbound_id,
      picker_id,
      memo
    }
  })
}
export function setDeliveryStatus(outbound_id, delivery_id, memo) {
  return request({
    url: '/admin/Outbound/setDeliveryStatus',
    method: 'post',
    data: {
      outbound_id,
      delivery_id,
      memo
    }
  })
}
export function deleteOutboundStock(data) {
  return request({
    url: '/admin/Outbound/deleteOutboundStock',
    method: 'post',
    data: data
  })
}
export function deleteOutbount(data, memo, outbound_id) {
  return request({
    url: '/admin/Outbound/deleteOutbount',
    method: 'post',
    data: {
      data,
      memo,
      outbound_id
    }
  })
}
export function outboundOk(data, arr) {
  return request({
    url: '/admin/Outbound/outboundOk',
    method: 'post',
    data: {
      data,
      arr
    }
  })
}
export function abnormalOutbound(data) {
  return request({
    url: '/admin/Outbound/abnormalOutbound',
    method: 'post',
    data: data
  })
}
//  列表异常挂起
export function setAbnormal(id) {
  return request({
    url: '/admin/Outbound/setAbnormal',
    method: 'post',
    data: {
      id
    }
  })
}
// 提交备注信息
export function setMemoText(data) {
  return request({
    url: '/admin/Outbound/setMemoText',
    method: 'post',
    data: data
  })
}
