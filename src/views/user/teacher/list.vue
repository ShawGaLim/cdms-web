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
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        显示登陆密码
      </el-checkbox>
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
      <el-table-column label="教师ID" prop="id" sortable="custom" width="200px" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="登陆密码" width="200px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.importTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="教师ID" prop="id">
          <el-input v-model.number="temp.id" :disabled="dialogIDInputDisabled" />
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input v-model="temp.password" type="password" show-password />
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
import { getUser, insertUser, updateUser, deleteUser } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'TeacherList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        identity: '教师',
        page: 1,
        limit: 10,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        username: undefined,
        password: undefined
      },
      dialogDeleteVisible: false,
      dialogIDInputDisabled: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新教师用户信息',
        create: '添加教师用户'
      },
      rules: {
        id: [{ required: true, message: '请输入ID号' }, { type: 'number', message: 'ID号必须为数字' }],
        username: [{ required: true, message: '请输入姓名' }],
        password: [{ required: true, message: '请输入密码' }]
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
      getUser(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        username: undefined,
        password: undefined,
        identity: '教师'
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
          insertUser(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '成功添加新用户',
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
          updateUser(tempData).then(() => {
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
      deleteUser(this.temp).then(() => {
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
        const tHeader = ['教师ID', '姓名', '导入时间']
        const filterVal = ['id', 'username', 'importTime']
        const tData = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data: tData,
          filename: 'teacher-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
