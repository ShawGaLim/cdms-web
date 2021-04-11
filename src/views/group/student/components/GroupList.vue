<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="搜索功能未实装" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        创建
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
      <el-table-column label="小组编号" prop="id" sortable="custom" width="120px" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小组名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课设主题" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.topic===null ? '未选':row.topic.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小组人数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.member }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="watchMemberList(row)">
            查看成员
          </el-button>
          <el-button v-if="row.member < course.maxGroupMember" type="primary" size="mini" @click="handleJoin(row)">
            申请加入
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="加入操作确认" :visible.sync="dialogJoinVisible" center width="20%">
      <span>一次只能申请加入一个小组</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="JoinGroup()">
          确认
        </el-button>
        <el-button @click="dialogJoinVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="小组成员" :visible.sync="dialogMemberVisible">
      <el-table v-loading="memberListLoading" border :data="memberList">
        <el-table-column label="学号" prop="id" align="center">
          <template slot-scope="{row}">
            <span>{{ row.student.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.student.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份" align="center">
          <template slot-scope="{row}">
            <span>{{ row.identity }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="创建小组" :visible.sync="dialogCreateVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="小组名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroupByCourseId, insertGroup } from '@/api/group'
import { insertSG, getGroupSGs } from '@/api/sg'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'GroupList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      memberList: null,
      total: 0,
      listLoading: true,
      memberListLoading: true,
      listQuery: {
        courseId: null,
        page: 1,
        limit: 10,
        sort: '+id'
      },
      temp: {
        courseId: undefined,
        groupId: undefined,
        name: undefined,
        creator: {
          id: undefined
        }
      },
      dialogJoinVisible: false,
      dialogCreateVisible: false,
      dialogMemberVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入小组名' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符' }
        ]
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.courseId = this.course.id
      getGroupByCourseId(this.listQuery).then(response => {
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
        courseId: this.course.id,
        groupId: undefined,
        name: undefined,
        creator: {
          id: this.user.id
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertGroup(this.temp).then(() => {
            this.getList()
            this.dialogCreateVisible = false
            this.$notify({
              title: '操作成功',
              message: '成功创建小组',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('sg/getSGInfo')
          })
        }
      })
    },
    watchMemberList(row) {
      this.dialogMemberVisible = true
      this.memberListLoading = true
      this.resetTemp()
      this.temp.groupId = row.id
      getGroupSGs(this.temp).then(response => {
        this.memberList = response.data.items
        this.memberListLoading = false
      })
    },
    handleJoin(row) {
      this.dialogJoinVisible = true
      this.temp = {
        courseId: this.course.id,
        groupId: row.id,
        student: {
          id: this.user.id
        },
        identity: '组员'
      }
    },
    JoinGroup() {
      insertSG(this.temp).then(() => {
        this.dialogJoinVisible = false
        this.$notify({
          title: '操作成功',
          message: '成功加入小组',
          type: 'success',
          duration: 2000
        })
        this.$store.dispatch('sg/getSGInfo')
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
