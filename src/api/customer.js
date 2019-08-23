import request from '@/utils/request'

// 获取客户列表
export function getCustomerList(data) {
  return request({
    url: '/admin/Customer/getCustomerList',
    method: 'post',
    data: data
  })
}

// 添加客户
export function createCustomer(data) {
  return request({
    url: '/admin/Customer/createCustomer',
    method: 'post',
    data
  })
}
// 编辑客户
export function updateCustomer(data) {
  return request({
    url: '/admin/Customer/updateCustomer',
    method: 'post',
    data
  })
}
// 获取下拉客户数据
export function getCustomerStore(store_id) {
  return request({
    url: '/admin/Customer/getCustomerStore',
    method: 'post',
    data: {
      store_id
    }
  })
}
// 客户停用
export function handleDelete(data) {
  return request({
    url: '/admin/Customer/handleDelete',
    method: 'post',
    data: data
  })
}

