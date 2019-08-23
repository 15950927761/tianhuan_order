import request from '@/utils/request'

export function doBridgeRequest(token) {
  return request({
    url: '/admin/bridge/index?' + new Date().valueOf(),
    method: 'post',
    data: {
      token
    }
  })
}
