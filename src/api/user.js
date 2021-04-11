import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getUser(user) {
  return request({
    url: 'user/selectUserByIdentity',
    method: 'post',
    data: user
  })
}

export function insertUser(user) {
  return request({
    url: 'user/insertUser',
    method: 'post',
    data: user
  })
}

export function insertManyUsers(list) {
  return request({
    url: 'user/insertManyUsers',
    method: 'post',
    data: list
  })
}

export function updateUser(user) {
  return request({
    url: 'user/updateUser',
    method: 'post',
    data: user
  })
}

export function deleteUser(user) {
  return request({
    url: 'user/deleteUserById',
    method: 'post',
    data: user
  })
}

export function changePassword(user) {
  return request({
    url: 'user/changePassword',
    method: 'post',
    data: user
  })
}
