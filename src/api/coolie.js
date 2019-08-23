import request from '@/utils/request'

export function addEditCoolie(data) {
  return request({
    url: '/admin/Coolie/addEditCoolie',
    method: 'post',
    data: data
  })
}
export function fetchCoolieList(data) {
  return request({
    url: '/admin/Coolie/fetchCoolieList',
    method: 'post',
    data: data
  })
}
export function getCoolieType(post_id) {
  return request({
    url: '/admin/Coolie/getCoolieType',
    method: 'post',
    data: {
      post_id
    }
  })
}
export function getCoolieTypeOne() {
  return request({
    url: '/admin/Coolie/getCoolieTypeOne',
    method: 'post'
  })
}

