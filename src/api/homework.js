import request from '@/utils/request'

export function getHomeworkByCourseId(courseId) {
  return request({
    url: 'homework/selectHomeworkByCourseId',
    method: 'post',
    data: {
      courseId: courseId
    }
  })
}

export function insertHomework(homework) {
  return request({
    url: 'homework/insertHomework',
    method: 'post',
    data: homework
  })
}

export function updateHomework(homework) {
  return request({
    url: 'homework/updateHomework',
    method: 'post',
    data: homework
  })
}

export function deleteHomework(homeworkId) {
  return request({
    url: 'homework/deleteHomework',
    method: 'post',
    data: {
      id: homeworkId
    }
  })
}
