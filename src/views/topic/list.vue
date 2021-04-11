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
      <el-table-column label="题目编号" prop="id" sortable="custom" width="120px" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目要求" header-align="center" align="left">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目状态" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status==='临时' ? 'warning':'primary'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='固定'" size="mini" type="success" @click="handleModifyStatus(row,'固定')">
            固定
          </el-button>
          <el-button v-if="row.status!='临时'" size="mini" type="warning" @click="handleModifyStatus(row,'临时')">
            临时
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
        <el-form-item label="题目名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="题目要求" prop="content">
          <el-input v-model="temp.content" type="textarea" />
        </el-form-item>
        <el-form-item label="题目状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择初始状态">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
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
import { getTopicList, insertTopic, updateTopic, deleteTopic } from '@/api/topic'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'CourseList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        courseId: null,
        page: 1,
        limit: 10,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        courseId: undefined,
        name: undefined,
        content: undefined,
        status: undefined
      },
      dialogDeleteVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改题目',
        create: '添加新题目'
      },
      statusOptions: ['固定', '临时'],
      rules: {
        name: [{ required: true, message: '请输入题目名称' }],
        content: [{ required: true, message: '请输入题目要求' }],
        status: [{ required: true, message: '请选择初始状态' }]
      },
      downloadLoading: false
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.courseId = sessionStorage.getItem('courseId')
      getTopicList(this.listQuery).then((response) => {
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
      updateTopic(tempData).then(() => {
        this.getList()
        this.$notify({
          title: '操作成功',
          message: '成功切换状态',
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
        courseId: this.course.id,
        name: undefined,
        content: undefined,
        status: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertTopic(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '成功添加新主题',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          updateTopic(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '操作成功',
              message: '成功修改主题信息',
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
      deleteTopic(this.temp).then(() => {
        this.getList()
        this.dialogDeleteVisible = false
        this.$notify({
          title: '操作成功',
          message: '成功删除题目',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['题号', '题目名称', '题目要求', '题目状态', '创建时间']
        const filterVal = ['id', 'name', 'content', 'status', 'createTime']
        const tData = this.formatJson(filterVal)
        console.log(tData)
        console.log(this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data: tData,
          filename: this.course.name + '选题列表'
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

<style>
.el-table .cell{
  white-space: pre-wrap;
}
</style>
