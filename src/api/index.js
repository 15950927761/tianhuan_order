import request from '@/utils/request'

export function getWeekData(store_id) {
  return request({
    url: '/admin/Index/getWeekData',
    method: 'post',
    data: {
      store_id
    }
  })
}

