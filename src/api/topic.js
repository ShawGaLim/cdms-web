import request from '@/utils/request'

export function getTopic(topicId) {
  return request({
    url: 'topic/selectTopicById',
    method: 'post',
    data: {
      id: topicId
    }
  })
}

export function getTopicList(topic) {
  return request({
    url: 'topic/selectTopicByCourseId',
    method: 'post',
    data: topic
  })
}

export function insertTopic(topic) {
  return request({
    url: 'topic/insertTopic',
    method: 'post',
    data: topic
  })
}

export function insertTopicList(list) {
  return request({
    url: 'topic/insertManyTopics',
    method: 'post',
    data: list
  })
}

export function updateTopic(topic) {
  return request({
    url: 'topic/updateTopic',
    method: 'post',
    data: topic
  })
}

export function deleteTopic(topic) {
  return request({
    url: 'topic/deleteTopic',
    method: 'post',
    data: topic
  })
}
