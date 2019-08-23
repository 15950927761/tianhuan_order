import request from '@/utils/request'

export function addEditUnit(data) {
  return request({
    url: '/admin/Unit/addEditUnit',
    method: 'post',
    data: data
  })
}
export function fetchUnitList(data) {
  return request({
    url: '/admin/Unit/fetchUnitList',
    method: 'post',
    data: data
  })
}
export function getUnitList() {
  return request({
    url: '/admin/Unit/getUnitList',
    method: 'post'
  })
}

