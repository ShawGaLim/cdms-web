<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-back" @click="ReturnPublishPage()">
        返回
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleFilter()">
        刷新
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
    >
      <el-table-column label="小组编号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小组名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" header-align="center" align="left">
        <template slot-scope="{row}">
          <span>{{ row.statement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.submitTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status==='延时提交'?'danger':'primary'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="enterStudentHomework(row.group.id)">
            查看/评分
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSHByHomeworkId } from '@/api/sh'
import Pagination from '@/components/Pagination'

export default {
  name: 'HomeworkSubmitList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        homework: {
          id: undefined
        },
        name: undefined,
        page: 1,
        limit: 10
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
    this.listQuery.homework.id = this.$route.params.homeworkId
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSHByHomeworkId(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    enterStudentHomework(groupId) {
      const homeworkId = this.listQuery.homework.id
      this.$router.push(`/homework/student-submit/${homeworkId}-${groupId}`)
    },
    ReturnPublishPage() {
      this.$router.push(`/homework/publish`)
    }
  }
}
</script>

<style>
.el-table .cell{
  white-space: pre-wrap;
}
</style>
