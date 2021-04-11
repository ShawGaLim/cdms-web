<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card class="card-container">
          <div slot="header" class="card-header">
            <span>作业成绩</span>
          </div>
          <div style="margin: 20px;">
            <span>所有作业总分：{{ homeworkGradeTotal }}</span>
          </div>
          <el-table
            v-loading="homeworkLoading"
            :data="homeworkList"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="作业名" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.homework.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="我的分数/满分" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.grade }} / {{ row.homework.maxGrade }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="card-container">
          <div slot="header" class="card-header">
            <span>答辩成绩</span>
          </div>
          <div style="text-align: center;">
            <span>答辩总分：{{ course.maxReplyGrade }}</span>
          </div>
          <div style="text-align: center;">
            <span>我的成绩：{{ replyGrade }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="card-container">
      <div slot="header" class="card-header">
        <span>总成绩</span>
      </div>
      <div style="text-align: center;">
        <span>课设总分：{{ homeworkGradeTotal + course.maxReplyGrade }} 分</span>
      </div>
      <div style="text-align: center;">
        <span>课设成绩：{{ totalGrade }} 分</span>
        <span style="margin-left: 30px">百分制折算：{{ parseInt(totalGrade / (homeworkGradeTotal + course.maxReplyGrade) * 100) }} 分</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllMyGrade } from '@/api/grade'
import { getHomeworkByCourseId } from '@/api/homework'
import { getSCByStudentId } from '@/api/sc'

export default {
  name: 'HomeworkDetailTeacher',
  data() {
    return {
      homeworkGradeTotal: 0,
      homeworkList: null,
      homeworkLoading: true,
      replyGrade: null,
      replyLoading: true,
      totalGrade: null
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
        this.getInfo()
      }
    })
  },
  methods: {
    getInfo() {
      this.replyLoading = true
      this.homeworkLoading = true
      const temp = {
        student: {
          id: this.user.id
        },
        groupId: this.sg.groupId
      }
      getAllMyGrade(temp).then((response) => {
        this.homeworkList = response.data.items
        this.homeworkLoading = false
      })
      getHomeworkByCourseId(sessionStorage.getItem('courseId')).then((response) => {
        const homeworkGradeList = response.data.items
        homeworkGradeList.forEach((e) => {
          this.homeworkGradeTotal += e.maxGrade
        })
      })
      getSCByStudentId(this.user.id).then(response => {
        const scList = response.data.items
        const courseId = sessionStorage.getItem('courseId')
        for (let index = 0; index < scList.length; index++) {
          if (parseInt(courseId) === parseInt(scList[index].course.id)) {
            this.replyGrade = scList[index].replyGrade
            this.totalGrade = scList[index].totalGrade
            this.replyLoading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  &-container {
    margin: 30px;
  }
  &-header {
    text-align: center;
  }
}
</style>
