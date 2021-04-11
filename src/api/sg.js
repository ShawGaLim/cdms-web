import request from '@/utils/request'

export function getSGInfo(sg) {
  return request({
    url: 'sg/selectSG',
    method: 'post',
    data: sg
  })
}

export function getGroupSGs(sg) {
  return request({
    url: 'sg/selectGroupSGs',
    method: 'post',
    data: sg
  })
}

export function insertSG(sg) {
  return request({
    url: 'sg/insertSG',
    method: 'post',
    data: sg
  })
}

export function updateSG(sg) {
  return request({
    url: 'sg/updateSG',
    method: 'post',
    data: sg
  })
}

export function deleteSG(sg) {
  return request({
    url: 'sg/deleteSG',
    method: 'post',
    data: sg
  })
}
