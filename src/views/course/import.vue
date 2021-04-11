<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <br>
    <el-button v-if="hasUploadAlready" style="display:block;margin:0 auto" type="primary" icon="el-icon-edit" @click="handleImport">
      全部添加
    </el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { insertManyCourses } from '@/api/course'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      hasUploadAlready: false
    }
  },
  methods: {
    beforeUpload(file) {
      const isLessThen = file.size / 1024 / 1024 < 5

      if (isLessThen) {
        return true
      }

      this.$message({
        message: '上传文件不能大于5M',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      this.hasUploadAlready = true
    },
    handleImport() {
      const importData = this.tableData.map(item => {
        return {
          id: item['课程编号'],
          name: item['课程名'],
          teacher: {
            id: item['任课教师ID']
          }
        }
      })
      insertManyCourses(importData).then(() => {
        this.$notify({
          title: '操作成功',
          message: '用户导入成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
