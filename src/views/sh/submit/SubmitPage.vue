<template>
  <div class="tab-container">
    <el-button class="filter-item" type="primary" icon="el-icon-back" @click="backToHomeworkList()">
      返回
    </el-button>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="新的提交" name="新的提交">
        <el-form ref="dataForm" :model="temp" label-position="top" style="width: 50%; margin:30px;">
          <el-form-item label="提交说明" prop="statement">
            <el-input v-model="temp.statement" type="textarea" />
          </el-form-item>
          <el-form-item label="提交附件" prop="file">
            <el-upload
              ref="upload"
              accept=".docx, .doc, .pdf, .txt, .zip, .rar, .7z"
              :headers="headers"
              :file-list="fileList"
              :limit="1"
              :data="submitInfo"
              :on-exceed="onExceed"
              :action="uploadUrl"
              :show-file-list="true"
              :auto-upload="false"
              :on-success="onSuccess"
              :on-error="onError"
            >
              <el-button type="primary" size="small">添加文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div style="margin: 30px;text-align: center">
          <el-button type="primary" @click="submitHomework()">
            提交
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="hasSubmit" label="已提交查询" name="已提交查询">
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
          <el-col :span="4">
            <el-card class="card-container">
              <div slot="header" class="card-header">
                <span>我的分数/满分</span>
              </div>
              <div v-loading="shLoading" style="text-align: center;">
                <span>{{ myGrade }}/{{ sh.homework.maxGrade }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSHInfo, insertSH } from '@/api/sh'
import { getMyGrade } from '@/api/grade'
import { getToken } from '@/utils/auth'
import { getFile } from '@/api/file'

export default {
  name: 'Group',
  data() {
    return {
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      submitInfo: null,
      uploadUrl: '/api/file/upload',
      fileList: [],
      shLoading: true,
      activeName: '新的提交',
      temp: {
        courseId: null,
        group: {
          id: null
        },
        homework: {
          id: null
        },
        statement: ''
      },
      hasSubmit: false,
      myGrade: null
    }
  },
  computed: {
    ...mapGetters([
      'course',
      'user',
      'sg'
    ])
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    this.$store.dispatch('sg/getSGInfo').then(() => {
      this.getInfo()
    })
  },
  methods: {
    getInfo() {
      this.shLoading = true
      const temp1 = {
        courseId: sessionStorage.getItem('courseId'),
        group: {
          id: this.sg.groupId
        },
        homework: {
          id: this.$route.params.homeworkId
        }
      }
      const temp2 = {
        groupId: this.sg.groupId,
        homework: {
          id: this.$route.params.homeworkId
        },
        student: {
          id: this.user.id
        }
      }
      getSHInfo(temp1).then((response) => {
        this.sh = response.sh
        if (this.sh !== null) {
          this.hasSubmit = true
          getMyGrade(temp2).then((response) => {
            this.myGrade = response.grade.grade
            this.shLoading = false
          })
        }
      })
    },
    onExceed() {
      return this.$alert('只能上传一个文件', {
        confirmButtonText: '确定'
      })
    },
    onSuccess(res) {
      this.fileList = []
      if (res.code === 200) {
        this.$notify({
          title: '操作成功',
          message: '文件上传成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$message.error('文件上传失败')
      }
    },
    onError(res) {
      this.$alert('文件上传失败', {
        confirmButtonText: '确定'
      })
    },
    submitHomework() {
      this.temp.courseId = this.course.id
      this.temp.homework.id = this.$route.params.homeworkId
      this.temp.group.id = this.sg.groupId
      this.submitInfo = {
        courseId: this.course.id,
        homeworkId: this.$route.params.homeworkId,
        groupId: this.sg.groupId
      }
      insertSH(this.temp).then(() => {
        this.$refs.upload.submit()
        this.activeName = '已提交查询'
        this.getInfo()
        this.$notify({
          title: '操作成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    backToHomeworkList() {
      this.$router.push(`/s-homework/list`)
    },
    downFile() {
      const temp1 = {
        homework: {
          id: this.$route.params.homeworkId
        },
        courseId: sessionStorage.getItem('courseId'),
        group: {
          id: this.sg.groupId
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
.tab-container {
  margin: 30px;
}
.card {
  &-container {
    margin: 30px;
  }
  &-header {
    text-align: center;
  }
}
</style>
