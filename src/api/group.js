import request from '@/utils/request'

export function getGroupByCourseId(group) {
  return request({
    url: 'group/selectGroupByCourseId',
    method: 'post',
    data: group
  })
}

export function getGroup(group) {
  return request({
    url: 'group/selectGroup',
    method: 'post',
    data: group
  })
}

export function insertGroup(group) {
  return request({
    url: 'group/insertGroup',
    method: 'post',
    data: group
  })
}

export function updateGroup(group) {
  return request({
    url: 'group/updateGroup',
    method: 'post',
    data: group
  })
}

export function deleteGroup(group) {
  return request({
    url: 'group/deleteGroup',
    method: 'post',
    data: group
  })
}
