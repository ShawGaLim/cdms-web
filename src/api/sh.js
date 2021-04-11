import request from '@/utils/request'

export function getSHByHomeworkId(sh) {
  return request({
    url: 'sh/selectByHomeworkId',
    method: 'post',
    data: sh
  })
}

export function getMySH(sh) {
  return request({
    url: 'sh/selectMySH',
    method: 'post',
    data: sh
  })
}

export function getSHInfo(sh) {
  return request({
    url: 'sh/selectSH',
    method: 'post',
    data: sh
  })
}

export function insertSH(sh) {
  return request({
    url: 'sh/insertSH',
    method: 'post',
    data: sh
  })
}
