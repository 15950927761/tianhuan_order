import request from '@/utils/request'

export function addEditStore(data) {
  return request({
    url: '/admin/Store/addEditStore',
    method: 'post',
    data: data
  })
}
export function fetchStorList(data) {
  return request({
    url: '/admin/Store/fetchStorList',
    method: 'post',
    data: data
  })
}
export function getWareAreaList(store_id) {
  return request({
    url: '/admin/Store/getWareAreaList',
    method: 'post',
    data: {
      store_id
    }
  })
}
export function getStoreSelectList(data) {
  return request({
    url: '/admin/Store/getStoreSelectList',
    method: 'post',
    data: data
  })
}
// 根据商户id获取仓库
export function getStoreWareAreaList(store_id) {
  return request({
    url: '/admin/Store/getStoreWareAreaList',
    method: 'post',
    data: {
      store_id
    }
  })
}
export function getCount(store_id) {
  return request({
    url: '/admin/Index/getCount',
    method: 'post',
    data: {
      store_id
    }
  })
}
// 获取该商户关联账号
export function getStoreSelectBinding(store_id) {
  return request({
    url: '/admin/Store/getStoreSelectBinding',
    method: 'post',
    data: {
      store_id
    }
  })
}

