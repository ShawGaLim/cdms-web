<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="搜索功能未实装" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
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
      <el-table-column label="题目要求" align="center">
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
      <el-table-column label="操作" width="150px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleSelect(row)">
            选择题目
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="选择确认" :visible.sync="dialogConfirmVisible" center width="20%">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectTopic()">
          确认
        </el-button>
        <el-button @click="dialogConfirmVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTopicList } from '@/api/topic'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { updateGroup } from '@/api/group'

export default {
  name: 'TopicList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        courseId: null,
        page: 1,
        limit: 10,
        sort: '+id'
      },
      temp: {
        courseId: undefined,
        id: undefined,
        topic: {
          id: undefined
        }
      },
      dialogConfirmVisible: false
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
      this.listQuery.courseId = this.course.id
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    resetTemp() {
      this.temp = {
        courseId: this.course.id,
        id: this.sg.groupId,
        topic: {
          id: undefined
        }
      }
    },
    handleSelect(row) {
      this.dialogConfirmVisible = true
      this.resetTemp()
      this.temp.topic.id = row.id
    },
    selectTopic() {
      updateGroup(this.temp).then(() => {
        this.$notify({
          title: '操作成功',
          message: '成功选择题目',
          type: 'success',
          duration: 2000
        })
        this.$store.dispatch('sg/getSGInfo')
        this.dialogConfirmVisible = false
      })
    }
  }
}
</script>
