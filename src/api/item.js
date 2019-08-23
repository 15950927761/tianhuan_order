import request from '@/utils/request'

export function addEditItem(data) {
  return request({
    url: '/admin/Item/addEditItem',
    method: 'post',
    data: data
  })
}
export function fetchItemList(data) {
  return request({
    url: '/admin/Item/fetchItemList',
    method: 'post',
    data: data
  })
}
export function getItemList(store_id = '') {
  return request({
    url: '/admin/Item/getItemList',
    method: 'post',
    data: {
      store_id
    }
  })
}
export function getItemSelect(data) {
  return request({
    url: '/admin/Item/getItemSelect',
    method: 'post',
    data: data
  })
}

