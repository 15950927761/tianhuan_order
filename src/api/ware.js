import request from '@/utils/request'

export function addEditWare(data) {
  return request({
    url: '/admin/Ware/addEditWare',
    method: 'post',
    data: {
      data
    }
  })
}
export function fetchWareList(data) {
  return request({
    url: '/admin/Ware/fetchWareList',
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

