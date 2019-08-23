import request from '@/utils/request'

export function addEditPost(data) {
  return request({
    url: '/admin/Post/addEditPost',
    method: 'post',
    data: data
  })
}
export function fetchPostList(data) {
  return request({
    url: '/admin/Post/fetchPostList',
    method: 'post',
    data: data
  })
}
export function getPostList() {
  return request({
    url: '/admin/Post/getPostList',
    method: 'post'
  })
}

