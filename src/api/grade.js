import request from '@/utils/request'

export function getGrade(grade) {
  return request({
    url: 'grade/selectGrade',
    method: 'post',
    data: grade
  })
}

export function getMyGrade(grade) {
  return request({
    url: 'grade/selectMyGrade',
    method: 'post',
    data: grade
  })
}

export function getAllMyGrade(grade) {
  return request({
    url: 'grade/selectMyAllGrade',
    method: 'post',
    data: grade
  })
}

export function setGrade(grade) {
  return request({
    url: 'grade/insertGrade',
    method: 'post',
    data: grade
  })
}

export function changeGrade(grade) {
  return request({
    url: 'grade/updateGrade',
    method: 'post',
    data: grade
  })
}
