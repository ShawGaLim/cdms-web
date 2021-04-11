<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="搜索功能未实装" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="课程编号" prop="id" sortable="custom" width="150px" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任课教师" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教师ID" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='已开课'" size="mini" type="success" @click="handleModifyStatus(row,'已开课')">
            开课
          </el-button>
          <el-button v-if="row.status!='未开课'" size="mini" @click="handleModifyStatus(row,'未开课')">
            闭课
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程ID" prop="id">
          <el-input v-model.number="temp.id" :disabled="dialogIDInputDisabled" />
        </el-form-item>
        <el-form-item label="课程名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="任课教师ID" prop="teacher.id">
          <el-input v-model.number="temp.teacher.id" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除操作确认" :visible.sync="dialogDeleteVisible" center width="20%">
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteData()">
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
import { getCourse, insertCourse, updateCourse, deleteCourse } from '@/api/course'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'CourseList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        已开课: 'success',
        未开课: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        id: undefined,
        name: undefined,
        status: undefined,
        teacher: {
          id: undefined
        }
      },
      dialogDeleteVisible: false,
      dialogIDInputDisabled: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新课程信息',
        create: '添加课程'
      },
      rules: {
        id: [{ required: true, message: '请输入课程编号' }, { type: 'number', message: '课程编号必须为数字' }],
        name: [{ required: true, message: '请输入课程名' }],
        teacher: {
          id: [{ required: true, message: '请输入教师ID' }, { type: 'number', message: '教师ID必须为数字' }]
        }
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCourse(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      const tempData = Object.assign({}, row)
      tempData.status = status
      updateCourse(tempData).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '操作成功',
          message: '成功更新用户信息',
          type: 'success',
          duration: 2000
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        teacher: {
          id: undefined
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogIDInputDisabled = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertCourse(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '成功添加新课程',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogIDInputDisabled = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCourse(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '成功更新用户信息',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row)
      this.dialogDeleteVisible = true
    },
    deleteData() {
      deleteCourse(this.temp).then(() => {
        this.getList()
        this.dialogDeleteVisible = false
        this.$notify({
          title: '操作成功',
          message: '成功删除用户信息',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['课程编号', '课程名', '任课教师', '任课教师ID', '创建时间']
        const filterVal = ['id', 'name', 'teacher.username', 'teacher.id', 'createTime']
        const tData = this.formatJson(filterVal)
        console.log(tData)
        console.log(this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data: tData,
          filename: 'course-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'teacher.username') {
          return v['teacher'].username
        } else if (j === 'teacher.id') {
          return v['teacher'].id
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
