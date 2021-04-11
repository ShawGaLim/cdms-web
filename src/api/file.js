import request from '@/utils/request'

export function getFile(sh) {
  return request({
    url: 'file/download',
    method: 'post',
    data: sh,
    responseType: 'blob'
  })
}
