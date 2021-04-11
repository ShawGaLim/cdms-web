<template>
  <div class="homework-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate()">
        发布作业
      </el-button>
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
            <span class="homework-title">{{ homework.name }}</span>
            <el-tag :type="deadlineTagType(homework.deadline)" style="margin-left: 10px">截止日期：{{ homework.deadline }}</el-tag>
            <el-tag type="primary" style="margin-left: 10px">满分：{{ homework.maxGrade }}</el-tag>
            <div style="float: right;">
              <el-button size="small" @click="openHomework(homework.id)">
                提交情况
              </el-button>
              <el-button type="primary" size="small" @click="handleUpdate(homework)">
                修改
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(homework.id)">
                删除
              </el-button>
            </div>
          </div>
          <div class="card-content">
            <span>{{ homework.content }}</span>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding: 20px;">
        <el-form-item label="作业名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="作业要求" prop="content">
          <el-input v-model="temp.content" type="textarea" />
        </el-form-item>
        <el-form-item label="满分分值" prop="maxGrade">
          <el-input-number v-model="temp.maxGrade" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker v-model="temp.deadline" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createHomework():confirmUpdate()">
          确认
        </el-button>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除操作确认" :visible.sync="dialogDeleteVisible" center width="20%">
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="confirmDelete()">
          确认
        </el-button>
        <el-button @click="dialogDeleteVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getHomeworkByCourseId, insertHomework, updateHomework, deleteHomework } from '@/api/homework'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeworkListTeacher',
  data() {
    return {
      timeLineLoading: true,
      reverse: false,
      list: null,
      courseId: '',
      dialogVisible: false,
      dialogDeleteVisible: false,
      temp: {
        id: '',
        courseId: '',
        name: '',
        content: '',
        maxGrade: 100,
        deadline: ''
      },
      dialogStatus: '',
      textMap: {
        update: '修改作业',
        create: '发布作业'
      },
      rules: {
        name: [{ required: true, message: '请输入作业名名' }],
        content: [{ required: true, message: '请输入作业要求' }],
        maxGrade: [{ required: true, message: '请设置最大分值' }],
        deadline: [{ required: true, message: '请设置截止日期' }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '一天后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', new Date())
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一个月后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'course',
      'user'
    ])
  },
  created() {
    this.getList()
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
    resetTemp() {
      this.temp = {
        courseId: this.course.id,
        name: '',
        content: '',
        maxGrade: 100,
        deadline: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createHomework() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertHomework(this.temp).then(() => {
            this.dialogVisible = false
            this.getList()
            this.$notify({
              title: '操作成功',
              message: '成功发布作业',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    openHomework(homeworkId) {
      this.$router.push(`/homework/submit-list/${homeworkId}`)
    },
    handleUpdate(homework) {
      this.resetTemp()
      this.temp = Object.assign({}, homework)
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    confirmUpdate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateHomework(this.temp).then(() => {
            this.dialogVisible = false
            this.getList()
            this.$notify({
              title: '操作成功',
              message: '成功修改作业',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(homeworkId) {
      this.resetTemp()
      this.dialogDeleteVisible = true
      this.temp.id = homeworkId
    },
    confirmDelete() {
      deleteHomework(this.temp.id).then(() => {
        this.getList()
        this.dialogDeleteVisible = false
        this.$notify({
          title: '操作成功',
          message: '成功删除作业',
          type: 'success',
          duration: 2000
        })
      })
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
