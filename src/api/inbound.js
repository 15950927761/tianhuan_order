import request from '@/utils/request'

export function addInbound(data) {
  return request({
    url: '/admin/Inbound/addInbound',
    method: 'post',
    data: data
  })
}
export function fetchInboundList(data) {
  return request({
    url: '/admin/Inbound/fetchInboundList',
    method: 'post',
    data: data
  })
}
export function getBillNumber() {
  return request({
    url: '/admin/Inbound/getBillNumber',
    method: 'post'
  })
}
export function getTypeItemList(inbound_id) {
  return request({
    url: '/admin/Inbound/getTypeItemList',
    method: 'post',
    data: {
      inbound_id
    }
  })
}
export function getBillInfo(inbound_id) {
  return request({
    url: '/admin/Inbound/getBillInfo',
    method: 'post',
    data: {
      inbound_id
    }
  })
}
export function editItemFind(data) {
  return request({
    url: '/admin/Inbound/editItemFind',
    method: 'post',
    data: data
  })
}
export function addWarehousing(itemList, inboundInfo) {
  return request({
    url: '/admin/Inbound/addWarehousing',
    method: 'post',
    data: {
      itemList,
      inboundInfo
    }
  })
}
export function getStoreWareList(id, type) {
  return request({
    url: '/admin/Inbound/getStoreWareList',
    method: 'post',
    data: {
      id,
      type
    }
  })
}
export function deleteInbound(id) {
  return request({
    url: '/admin/Inbound/deleteInbound',
    method: 'post',
    data: {
      id
    }
  })
}
export function setAgainReview(id, data, type = 1) {
  return request({
    url: '/admin/Inbound/setAgainReview',
    method: 'post',
    data: {
      id,
      data,
      type
    }
  })
}
export function deleteInboudItem(inbound_id, id, listLength) {
  return request({
    url: '/admin/Inbound/deleteInboudItem',
    method: 'post',
    data: {
      id,
      inbound_id,
      listLength
    }
  })
}

