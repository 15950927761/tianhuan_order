import request from '@/utils/request'

export function fetchStockTotalList(data) {
  return request({
    url: '/admin/Stocktotal/fetchStockTotalList',
    method: 'post',
    data: data
  })
}
export function fetchDetailList(data) {
  return request({
    url: '/admin/Stocktotal/fetchDetailList',
    method: 'post',
    data: data
  })
}
