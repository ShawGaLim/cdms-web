<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleFilter()">
        刷新
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-tooltip content="设置课程设计成绩占总成绩的比例，默认为100%" placement="top">
        <el-button type="primary" icon="el-icon-setting" @click="setRate()">
          {{ showSet===false?'设置':'保存' }}
        </el-button>
      </el-tooltip>
      <el-input-number v-if="showSet" v-model="rate" :min="0" :max="100" />
    </div>

    <div class="filter-container">
      <span>作业总分：{{ homeworkGradeTotal }}</span>
      <span style="margin-left: 20px">答辩总分：{{ course.maxReplyGrade }}</span>
      <span style="margin-left: 20px">课设总分：{{ homeworkGradeTotal + course.maxReplyGrade }}</span>
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
      <el-table-column label="学号" prop="id" sortable="custom" width="150px" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.student.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.student.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答辩成绩" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.replyGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业成绩" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalGrade - row.replyGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课设总成绩" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课设总成绩(百分制)" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ parseInt(row.totalGrade / (homeworkGradeTotal + course.maxReplyGrade) * 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课设成绩(占比)" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ parseInt(row.totalGrade / (homeworkGradeTotal + course.maxReplyGrade) * rate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleUpdateReply(row)">
            修改答辩成绩
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="设置答辩成绩" :visible.sync="dialogReplyVisible" center width="20%">
      <div style="text-align: center;">
        <el-input-number v-model="temp.replyGrade" :min="0" :max="course.maxReplyGrade" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateReplyGrade()">
          确认
        </el-button>
        <el-button @click="dialogReplyVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSCByCourseId, setReplyGrade } from '@/api/sc'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { getHomeworkByCourseId } from '@/api/homework'

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
      showSet: false,
      homeworkGradeList: null,
      rate: 100,
      homeworkGradeTotal: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        course: {
          id: null
        },
        page: 1,
        limit: 10,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        course: {
          id: null
        },
        student: {
          id: null
        },
        replyGrade: 0
      },
      dialogReplyVisible: false,
      dialogHomeworkVisible: false,
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
      this.homeworkGradeTotal = 0
      this.listLoading = true
      this.listQuery.course.id = sessionStorage.getItem('courseId')
      getSCByCourseId(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
      getHomeworkByCourseId(this.listQuery.course.id).then((response) => {
        this.homeworkGradeList = response.data.items
        this.homeworkGradeList.forEach((e) => {
          this.homeworkGradeTotal += e.maxGrade
        })
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
    setRate() {
      if (this.showSet === false) {
        this.showSet = true
      } else {
        this.showSet = false
        this.getList()
      }
    },
    handleUpdateReply(row) {
      this.dialogReplyVisible = true
      this.temp = {
        course: {
          id: this.course.id
        },
        student: {
          id: row.student.id
        },
        replyGrade: row.replyGrade
      }
    },
    updateReplyGrade() {
      setReplyGrade(this.temp).then(() => {
        this.dialogReplyVisible = false
        this.getList()
        this.$notify({
          title: '操作成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['学号', '姓名', '答辩成绩', '作业成绩', '课程总成绩', '课设总成绩（百分制）', '课设成绩（占比）']
        const filterVal = ['student.id', 'student.username', 'replyGrade', 'homeworkGrade', 'totalGrade', 'totalGrade2', 'totalGrade3']
        const tData = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data: tData,
          filename: this.course.name + '课程成绩'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'student.id') {
          return v['student'].id
        } else if (j === 'student.username') {
          return v['student'].username
        } else if (j === 'replyGrade') {
          return v['replyGrade']
        } else if (j === 'homeworkGrade') {
          return v['totalGrade'] - v['replyGrade']
        } else if (j === 'totalGrade') {
          return v['totalGrade']
        } else if (j === 'totalGrade2') {
          return parseInt(v['totalGrade'] / (this.homeworkGradeTotal + this.course.maxReplyGrade) * 100)
        } else if (j === 'totalGrade3') {
          return parseInt(v['totalGrade'] / (this.homeworkGradeTotal + this.course.maxReplyGrade) * this.rate)
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

<style lang="scss" scoped>
.filter {
  &-container {
    margin: 20px;
  }
}
</style>
