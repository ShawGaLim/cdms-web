<template>
  <div class="app-container">
    <el-button class="filter-item" type="primary" icon="el-icon-back" @click="backSubmitListPage()">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <el-card class="card-container">
          <div slot="header" class="card-header">
            <span>提交详情</span>
          </div>
          <el-form v-loading="shLoading" label-position="left" label-width="90px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="小组编号：">
                  <span>{{ sh.group.id }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="小组名：">
                  <span>{{ sh.group.name }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="题目名称：">
              <span>{{ sh.topic.name }}</span>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="提交时间：">
                  <span>{{ sh.submitTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="提交状态：">
                  <el-tag :type="sh.status==='延时提交'?'danger':'primary'">{{ sh.status }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-loading="shLoading" label-position="top">
            <el-form-item label="提交说明">
              <span style="white-space: pre-wrap;">{{ sh.statement }}</span>
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            <el-button v-if="sh.fileName!==null" type="primary" size="small" @click="downFile()">
              下载附件
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card-container">
          <div slot="header" class="card-header">
            <span>小组各成员作业分数</span>
          </div>
          <el-table
            v-loading="shLoading"
            :data="memberList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="组员姓名" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.student.username }}</span>
              </template>
            </el-table-column>
            <el-table-column label="身份" width="150px" align="center">
              <template slot-scope="{row}">
                <el-tag :type="row.identity==='组长'?'success':'primary'">{{ row.identity }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分数/满分" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ getStudentGrade(row) }}/{{ sh.homework.maxGrade }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleSet(row)">
                  打分/改分
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="设置分数" :visible.sync="dialogGradeVisible" center width="20%">
      <div style="text-align: center;">
        <el-input-number v-model="temp.grade" :min="0" :max="sh.homework.maxGrade" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setStudentGrade()">
          确认
        </el-button>
        <el-button @click="dialogGradeVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSHInfo } from '@/api/sh'
import { getGroupSGs } from '@/api/sg'
import { getGrade, setGrade } from '@/api/grade'
import { getFile } from '@/api/file'

export default {
  name: 'HomeworkDetailTeacher',
  data() {
    return {
      shLoading: true,
      memberList: null,
      gradeList: null,
      dialogGradeVisible: false,
      sh: {
        group: {
          id: '',
          name: ''
        },
        topic: {
          name: ''
        },
        homework: {
          maxGrade: ''
        }
      },
      temp: {
        homeworkId: null,
        groupId: null,
        studentId: null,
        courseId: null,
        grade: 0
      }
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
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.shLoading = true
      const temp1 = {
        homework: {
          id: this.$route.params.homeworkId
        },
        courseId: sessionStorage.getItem('courseId'),
        group: {
          id: this.$route.params.groupId
        }
      }
      getSHInfo(temp1).then((response) => {
        this.sh = response.sh
      })
      const temp2 = {
        homework: {
          id: this.$route.params.homeworkId
        },
        courseId: sessionStorage.getItem('courseId'),
        groupId: this.$route.params.groupId
      }
      getGroupSGs(temp2).then((response) => {
        this.memberList = response.data.items
        getGrade(temp2).then((response) => {
          this.gradeList = response.data.items
          this.shLoading = false
        })
      })
    },
    restTemp() {
      this.temp = {
        homeworkId: this.$route.params.homeworkId,
        groupId: this.$route.params.groupId,
        studentId: '',
        grade: 0
      }
    },
    handleSet(row) {
      this.restTemp()
      this.temp.studentId = row.student.id
      this.temp.courseId = this.course.id
      this.dialogGradeVisible = true
    },
    setStudentGrade() {
      setGrade(this.temp).then(() => {
        this.getInfo()
        this.dialogGradeVisible = false
        this.$notify({
          title: '操作成功',
          message: '打分成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    backSubmitListPage() {
      const homeworkId = this.$route.params.homeworkId
      this.$router.push(`/homework/submit-list/${homeworkId}`)
    },
    getStudentGrade(row) {
      let grade = 0
      if (this.gradeList !== null) {
        this.gradeList.forEach((e) => {
          if (e.student.id === row.student.id) {
            grade = e.grade
          }
        })
      }
      return grade
    },
    downFile() {
      const temp1 = {
        homework: {
          id: this.$route.params.homeworkId
        },
        courseId: sessionStorage.getItem('courseId'),
        group: {
          id: this.$route.params.groupId
        }
      }
      getFile(temp1).then((response) => {
        const content = response.data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = this.sh.fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()

          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, this.sh.fileName)
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
