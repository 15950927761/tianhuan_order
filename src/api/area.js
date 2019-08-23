import request from '@/utils/request'

export function addEditArea(data) {
  return request({
    url: '/admin/Area/addEditArea',
    method: 'post',
    data: data
  })
}
export function fetchAreaList(data) {
  return request({
    url: '/admin/Area/fetchAreaList',
    method: 'post',
    data: data
  })
}
export function getStoreWareArea(store_id, type) {
  return request({
    url: '/admin/Area/getStoreWareArea',
    method: 'post',
    data: {
      store_id,
      type
    }
  })
}

