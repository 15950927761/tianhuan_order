import request from '@/utils/request'

export function addEditReceipts(data) {
  return request({
    url: '/admin/Receipts/addEditReceipts',
    method: 'post',
    data: data
  })
}
export function fetchReceiptsList(data) {
  return request({
    url: '/admin/Receipts/fetchReceiptsList',
    method: 'post',
    data: data
  })
}
// 收款明细
export function receiptsDetailList(data) {
  return request({
    url: '/admin/Receipts/receiptsDetailList',
    method: 'post',
    data: data
  })
}
// 作废收款单
export function receiptDelete(data) {
  return request({
    url: '/admin/Receipts/receiptDelete',
    method: 'post',
    data: data
  })
}
// 作废收款单
export function getCustomerList(store_id) {
  return request({
    url: '/admin/Receipts/getCustomerList',
    method: 'post',
    data: {
      store_id
    }
  })
}
// 财务统计接口 receiptsTotal
export function receiptsTotal(data) {
  return request({
    url: '/admin/Receipts/receiptsTotal',
    method: 'post',
    data: data
  })
}
// 添加客户信息
export function addCustomer(data) {
  return request({
    url: '/admin/Receipts/addCustomer',
    method: 'post',
    data: data
  })
}

