import { getCourseInfo } from '@/api/course'

const getDefaultState = () => {
  return {
    id: '',
    name: '',
    teacherId: '',
    teacherName: '',
    maxGroupMember: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_TEACHER_ID: (state, teacherId) => {
    state.teacherId = teacherId
  },
  SET_TEACHER_NAME: (state, teacherName) => {
    state.teacherName = teacherName
  },
  SET_MAX_GROUP_MEMBER: (state, maxGroupMember) => {
    state.maxGroupMember = maxGroupMember
  },
  SET_MAX_REPLY_GRADE: (state, maxReplyGrade) => {
    state.maxReplyGrade = maxReplyGrade
  }
}

const actions = {
  getCourseInfo({ commit }, courseId) {
    return new Promise((resolve, reject) => {
      getCourseInfo(courseId).then(response => {
        const { course } = response

        if (!course) {
          return reject('课程信息获取失败')
        }

        const { id, name, teacher, maxGroupMember, maxReplyGrade } = course
        commit('SET_ID', id)
        commit('SET_NAME', name)
        commit('SET_MAX_GROUP_MEMBER', maxGroupMember)
        commit('SET_TEACHER_ID', teacher.id)
        commit('SET_TEACHER_NAME', teacher.username)
        commit('SET_MAX_REPLY_GRADE', maxReplyGrade)
        sessionStorage.setItem('courseId', id)
        resolve(course)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetCourse({ commit }) {
    return new Promise(resolve => {
      commit('RESET_STATE')
      sessionStorage.clear()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
