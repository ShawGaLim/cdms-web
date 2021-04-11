<template>
  <div class="homework-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-time" @click="SwitchReverse()">
        切换时序
      </el-button>
    </div>

    <el-timeline v-loading="timeLineLoading" :reverse="reverse">
      <el-timeline-item
        v-for="(homework, index) in list"
        :key="index"
        :timestamp="homework.createTime"
        placement="top"
        type="primary"
      >
        <el-card>
          <div slot="header" class="clearfix">
            <span class="homework-title">{{ homework.name }}&nbsp;</span>
            <el-tag :type="deadlineTagType(homework.deadline)">截止日期：{{ homework.deadline }}</el-tag>
            <div style="float: right;">
              <el-button type="primary" size="small" @click="openHomework(homework.id)">
                提交/查看成绩
              </el-button>
            </div>
          </div>
          <div class="card-content">
            <span>{{ homework.content }}</span>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getHomeworkByCourseId } from '@/api/homework'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeworkListTeacher',
  data() {
    return {
      timeLineLoading: true,
      reverse: false,
      list: null,
      courseId: ''
    }
  },
  computed: {
    ...mapGetters([
      'course',
      'user',
      'sg'
    ])
  },
  created() {
    this.$store.dispatch('sg/getSGInfo').then(() => {
      if (this.sg.groupId === '' || this.sg.groupId === null) {
        this.$message({
          message: '你还未加入小组，请先加入小组',
          type: 'error',
          duration: 2 * 1000
        })
        this.$router.push(`/group-management/student-page`)
      } else {
        this.getList()
      }
    })
  },
  methods: {
    getList() {
      this.timeLineLoading = true
      this.courseId = this.course.id === '' ? sessionStorage.getItem('courseId') : this.course.id
      getHomeworkByCourseId(this.courseId).then((response) => {
        this.list = response.data.items
        this.timeLineLoading = false
      })
    },
    SwitchReverse() {
      this.reverse = !this.reverse
    },
    openHomework(homeworkId) {
      this.$router.push(`/s-homework/submit-page/${homeworkId}`)
    },
    deadlineTagType(deadline) {
      const nowDate = new Date()
      const deadDate = new Date(deadline)
      const aweekLater = new Date()
      aweekLater.setTime(aweekLater.getTime() + 3600 * 1000 * 24 * 7)
      if (deadDate < nowDate) {
        return 'danger'
      } else if (deadDate < aweekLater) {
        return 'warning'
      } else {
        return 'success'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.homework {
  &-container {
    margin: 30px;
  }
  &-title {
    font-size: 22px;
    vertical-align: middle;
  }
}
.filter {
  &-container {
    margin: 30px;
  }
}
.card {
  &-content {
    white-space: pre-wrap;
  }
}
</style>
