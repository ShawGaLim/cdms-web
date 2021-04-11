import request from '@/utils/request'

export function getCourse(course) {
  return request({
    url: 'course/selectAllCourses',
    method: 'post',
    data: course
  })
}

export function getCourseInfo(courseId) {
  return request({
    url: 'course/info',
    method: 'post',
    data: {
      id: courseId
    }
  })
}

export function getTeacherCourse(teacherId) {
  return request({
    url: 'course/selectCourseByTeacherId',
    method: 'post',
    data: {
      id: teacherId
    }
  })
}

export function insertCourse(course) {
  return request({
    url: 'course/insertCourse',
    method: 'post',
    data: course
  })
}

export function insertManyCourses(list) {
  return request({
    url: 'course/insertManyCourses',
    method: 'post',
    data: list
  })
}

export function updateCourse(course) {
  return request({
    url: 'course/updateCourse',
    method: 'post',
    data: course
  })
}

export function deleteCourse(course) {
  return request({
    url: 'course/deleteCourse',
    method: 'post',
    data: course
  })
}
