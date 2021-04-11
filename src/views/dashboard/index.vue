<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="6" :offset="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户信息</span>
          </div>
          <el-form v-loading="courseLoading" label-position="right" label-width="70px">
            <el-form-item label="账号">
              <el-tag type="info">{{ id }}</el-tag>
            </el-form-item>
            <el-form-item label="用户名">
              <el-tag>{{ name }}</el-tag>
            </el-form-item>
            <el-form-item label="身份">
              <el-tag type="success">{{ roles.toString() }}</el-tag>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-setting" @click="handlePassword()">
            修改密码
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="4">
        <el-card v-if="roles.toString()!='管理员'" class="box-card">
          <div slot="header" class="clearfix">
            <span>当前课程信息</span>
            <el-tooltip class="item" effect="dark" content="选择了课程才能看到右侧菜单，灰色表示课程未开" placement="right">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <el-form v-loading="courseLoading" label-position="right" label-width="100px">
            <el-form-item v-if="roles.toString()==='学生'" label="选择课程">
              <el-select v-model="value" placeholder="请选择课程" @change="courseChange">
                <el-option v-for="item in list" :key="item.course.id" :label="item.course.name" :value="item.course.id" :disabled="item.course.status=='未开课'" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="roles.toString()==='教师'" label="选择课程">
              <el-select v-model="value" placeholder="请选择课程" @change="courseChange">
                <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="课程编号">
              <el-tag>{{ course.id }}</el-tag>
            </el-form-item>
            <el-form-item label="课程名">
              <el-tag>{{ course.name }}</el-tag>
            </el-form-item>
            <el-form-item label="小组最大人数">
              <el-tag>{{ course.maxGroupMember }} 人</el-tag>
            </el-form-item>
            <el-form-item label="答辩总分">
              <el-tag>{{ course.maxReplyGrade }} 分</el-tag>
            </el-form-item>
            <el-form-item v-if="roles.toString()==='学生'" label="教师ID">
              <el-tag>{{ course.teacherId }}</el-tag>
            </el-form-item>
            <el-form-item v-if="roles.toString()==='学生'" label="教师姓名">
              <el-tag>{{ course.teacherName }}</el-tag>
            </el-form-item>
          </el-form>
          <div v-if="roles.toString()==='教师' && course.id!==''" style="text-align: center">
            <el-button type="primary" icon="el-icon-setting" @click="handleUpdate()">
              设置
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="设置" :visible.sync="dialogSetVisible">
      <el-form :model="temp" label-position="left" label-width="80px">
        <el-form-item label="小组最大人数">
          <el-input-number v-model="temp.maxGroupMember" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="答辩总分">
          <el-input-number v-model="temp.maxReplyGrade" :min="1" :max="100" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateCourse()">
          确认
        </el-button>
        <el-button @click="dialogSetVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="dialogPasswordVisible" width="20%">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="top">
        <el-form-item label="请输入旧密码" prop="oldPassword">
          <el-input v-model="temp.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="请输入新密码" prop="newPassword">
          <el-input v-model="temp.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="newPassword2">
          <el-input v-model="temp.newPassword2" type="password" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePassword()">
          确认
        </el-button>
        <el-button @click="dialogPasswordVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSCByStudentId } from '@/api/sc'
import { getTeacherCourse, updateCourse } from '@/api/course'
import { changePassword } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Dashboard',
  data() {
    return {
      dialogPasswordVisible: false,
      dialogSetVisible: false,
      courseLoading: false,
      list: null,
      value: '',
      temp: {
        id: null,
        maxGroupMember: null,
        maxReplyGrade: null,
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码' }],
        newPassword: [{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少要6位' }],
        newPassword2: [{ required: true, message: '请再次输入新密码' }, { min: 6, message: '密码至少要6位' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name',
      'roles',
      'course'
    ])
  },
  created() {
    if (this.roles.toString() === '学生') {
      this.getStudentCourse()
    } else if (this.roles.toString() === '教师') {
      this.getTeacherCourse()
    }
  },
  methods: {
    getStudentCourse() {
      this.courseLoading = true
      getSCByStudentId(this.id).then(response => {
        this.list = response.data.items
        this.courseLoading = false
      })
    },
    getTeacherCourse() {
      this.courseLoading = true
      getTeacherCourse(this.id).then(response => {
        this.list = response.data.items
        this.courseLoading = false
      })
    },
    restTemp() {
      this.temp = {
        id: null,
        maxGroupMember: null,
        maxReplyGrade: null,
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    },
    handlePassword() {
      this.dialogPasswordVisible = true
    },
    changePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.newPassword === this.temp.newPassword2) {
            const userdata = {
              id: this.id,
              password: this.temp.oldPassword,
              newPassword: this.temp.newPassword
            }
            changePassword(userdata).then(() => {
              this.$notify({
                title: '操作成功',
                message: '密码修改成功',
                type: 'success',
                duration: 2000
              })
              this.restTemp()
              this.dialogPasswordVisible = false
            })
          } else {
            Message({
              message: '两次新密码不一样',
              type: 'error',
              duration: 2 * 1000
            })
          }
        }
      })
    },
    courseChange() {
      this.courseLoading = true
      this.$store.dispatch('course/getCourseInfo', this.value).then(() => {
        this.courseLoading = false
        this.$notify({
          title: '切换成功',
          message: '当前课程为: ' + this.course.name,
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate() {
      this.temp.id = this.course.id
      this.temp.maxReplyGrade = this.course.maxReplyGrade
      this.temp.maxGroupMember = this.course.maxGroupMember
      this.dialogSetVisible = true
    },
    updateCourse() {
      updateCourse(this.temp).then(() => {
        this.dialogSetVisible = false
        this.courseLoading = true
        this.$store.dispatch('course/getCourseInfo', this.course.id).then(() => {
          this.courseLoading = false
          this.$notify({
            title: '操作成功',
            message: '成功添加新课程',
            type: 'success',
            duration: 2000
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.clearfix {
  text-align: center;
}
</style>
