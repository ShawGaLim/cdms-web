import { getSGInfo } from '@/api/sg'
import store from '@/store'

const getDefaultState = () => {
  return {
    groupId: '',
    identity: '',
    hasJoinedGroup: '',
    isLeader: '',
    activeName: '',
    openGroupList: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_GROUPID: (state, groupId) => {
    state.groupId = groupId
  },
  SET_IDENTITY: (state, identity) => {
    state.identity = identity
  },
  SET_HAS_JOINED_GROUP: (state, hasJoinedGroup) => {
    state.hasJoinedGroup = hasJoinedGroup
  },
  SET_IS_LEADER: (state, isLeader) => {
    state.isLeader = isLeader
  },
  SET_ACTIVE_NAME: (state, activeName) => {
    state.activeName = activeName
  },
  SET_OPEN_GROUP_LIST: (state, openGroupList) => {
    state.openGroupList = openGroupList
  }
}

const actions = {
  getSGInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const temp = {
        courseId: sessionStorage.getItem('courseId'),
        student: {
          id: store.getters.user.id
        }
      }
      getSGInfo(temp).then(response => {
        const { sg } = response
        if (sg === null) {
          commit('SET_GROUPID', null)
          commit('SET_IDENTITY', null)
          commit('SET_HAS_JOINED_GROUP', false)
          commit('SET_IS_LEADER', false)
          commit('SET_OPEN_GROUP_LIST', true)
          commit('SET_ACTIVE_NAME', '小组列表')
        } else {
          const { groupId, identity } = sg
          commit('SET_GROUPID', groupId)
          commit('SET_IDENTITY', identity)
          commit('SET_HAS_JOINED_GROUP', true)
          commit('SET_OPEN_GROUP_LIST', false)
          if (identity === '组长') {
            commit('SET_IS_LEADER', true)
          } else {
            commit('SET_IS_LEADER', false)
          }
          commit('SET_ACTIVE_NAME', '我的小组')
        }
        resolve(sg)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetSG({ commit }) {
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
