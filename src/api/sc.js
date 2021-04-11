import request from '@/utils/request'

export function getSC(sc) {
  return request({
    url: 'sc/selectAllSCs',
    method: 'post',
    data: sc
  })
}

export function getSCByStudentId(studentId) {
  return request({
    url: 'sc/selectSCByUserId',
    method: 'post',
    data: {
      id: studentId
    }
  })
}

export function getSCByCourseId(sc) {
  return request({
    url: 'sc/selectSCByCourseId',
    method: 'post',
    data: sc
  })
}

export function insertSC(sc) {
  return request({
    url: 'sc/insertSC',
    method: 'post',
    data: sc
  })
}

export function insertManySCs(sc) {
  return request({
    url: 'sc/insertManySCs',
    method: 'post',
    data: sc
  })
}

export function setReplyGrade(sc) {
  return request({
    url: 'sc/updateReplyGrade',
    method: 'post',
    data: sc
  })
}

export function deleteSC(sc) {
  return request({
    url: 'sc/deleteSC',
    method: 'post',
    data: sc
  })
}
