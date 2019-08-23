import request from '@/utils/request'

export function addEditItemType(data) {
  return request({
    url: '/admin/Itemtype/addEditItemType',
    method: 'post',
    data: data
  })
}
export function fetchItemTypeList(data) {
  return request({
    url: '/admin/Itemtype/fetchItemTypeList',
    method: 'post',
    data: data
  })
}
export function getItemTypeList() {
  return request({
    url: '/admin/Itemtype/getItemTypeList',
    method: 'post'
  })
}

