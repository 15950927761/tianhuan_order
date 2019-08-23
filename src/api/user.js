import request from '@/utils/request'

export function setPassword(data) {
  return request({
    url: '/admin/Account/saveUserPassword',
    method: 'post',
    data: {
      data
    }
  })
}

