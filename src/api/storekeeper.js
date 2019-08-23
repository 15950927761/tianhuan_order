import request from '@/utils/request'

export function addEditStorekeeper(data) {
  return request({
    url: '/admin/Storekeeper/addEditStorekeeper',
    method: 'post',
    data: {
      data
    }
  })
}
export function getWareList() {
  return request({
    url: '/admin/Storekeeper/getWareList',
    method: 'post',
    data: {
    }
  })
}
export function fetchStorkeeperList(data) {
  return request({
    url: '/admin/Storekeeper/fetchStorkeeperList',
    method: 'post',
    data: data
  })
}
export function getStorekeeperList() {
  return request({
    url: '/admin/Storekeeper/getStorekeeperList',
    method: 'post',
    data: {
    }
  })
}

