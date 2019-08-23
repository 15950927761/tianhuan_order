import request from '@/utils/request'

export function addOutbound(data) {
  return request({
    url: '/admin/Storeoutbound/addOutbound',
    method: 'post',
    data: data
  })
}
export function fetchOutboundList(data) {
  return request({
    url: '/admin/Storeoutbound/fetchOutboundList',
    method: 'post',
    data: data
  })
}
export function getTypeItemList(outbound_id) {
  return request({
    url: '/admin/Storeoutbound/getTypeItemList',
    method: 'post',
    data: {
      outbound_id
    }
  })
}
export function getBillInfo(outbound_id) {
  return request({
    url: '/admin/Storeoutbound/getBillInfo',
    method: 'post',
    data: {
      outbound_id
    }
  })
}
export function editItemFind(data) {
  return request({
    url: '/admin/Storeoutbound/editItemFind',
    method: 'post',
    data: data
  })
}
export function deleteOutbound(id, memo) {
  return request({
    url: '/admin/Storeoutbound/deleteOutbound',
    method: 'post',
    data: {
      id,
      memo
    }
  })
}
export function setAgainReview(id, memo, customer_id, type = 1) {
  return request({
    url: '/admin/Storeoutbound/setAgainReview',
    method: 'post',
    data: {
      id,
      memo,
      customer_id,
      type
    }
  })
}
export function deleteOutboundItem(outbound_id, id, listLength) {
  return request({
    url: '/admin/Storeoutbound/deleteOutboundItem',
    method: 'post',
    data: {
      id,
      outbound_id,
      listLength
    }
  })
}
// 打印修改状态
export function setPrivateLodopStatus(data) {
  return request({
    url: '/admin/Storeoutbound/setPrivateLodopStatus',
    method: 'post',
    data: data
  })
}
// 自销出库
export function outboundOk(data, orderFind) {
  return request({
    url: '/admin/Storeoutbound/outboundOk',
    method: 'post',
    data: {
      data,
      orderFind
    }
  })
}

