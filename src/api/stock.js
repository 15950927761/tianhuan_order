import request from '@/utils/request'

export function getStockSelect(data) {
  return request({
    url: '/admin/Stock/getStockSelect',
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
export function fetchStckList(data) {
  return request({
    url: '/admin/Stock/fetchStckList',
    method: 'post',
    data: data
  })
}
export function getStockBranch(data) {
  return request({
    url: '/admin/Stock/getStockBranch',
    method: 'post',
    data: data
  })
}

// 统计
export function getStockList(data) {
  return request({
    url: '/admin/Stock/getStockList',
    method: 'post',
    data: data
  })
}

