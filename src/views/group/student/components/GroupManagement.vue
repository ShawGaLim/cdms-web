<template>
  <div class="app-container">
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
      <el-table-column label="组员ID" prop="id" sortable="custom" width="120px" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.student.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组员姓名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.student.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.identity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.identity==='组员'" type="success" size="mini" @click="handlePass(row)">
            转移组长
          </el-button>
          <el-button v-if="row.identity==='组员'" type="danger" size="mini" @click="handleRemove(row)">
            请出小组
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogConfirmVisible" center width="20%">
      <div slot="footer" class="dialog-footer">
        <el-button :type="dialogStatus==='pass'?'success':'danger'" @click="dialogStatus==='pass'?passLeader():removeMember()">
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
import { getGroupSGs, updateSG, deleteSG } from '@/api/sg'
import { mapGetters } from 'vuex'

export default {
  name: 'GroupManagement',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        courseId: null,
        groupId: null,
        sort: '+id'
      },
      temp: {
        courseId: undefined,
        groupId: undefined,
        student: {
          id: undefined
        },
        identity: undefined
      },
      dialogConfirmVisible: false,
      dialogStatus: '',
      textMap: {
        pass: '转移操作确认',
        remove: '请离操作确认'
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
      this.listQuery = {
        courseId: this.course.id,
        groupId: this.sg.groupId
      }
      getGroupSGs(this.listQuery).then(response => {
        this.list = response.data.items
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
        courseId: undefined,
        groupId: undefined,
        student: {
          id: undefined
        },
        identity: undefined
      }
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handlePass(row) {
      this.temp = Object.assign({}, row)
      this.temp.courseId = this.course.id
      this.temp.groupId = this.sg.groupId
      this.temp.identity = '组长'
      this.dialogStatus = 'pass'
      this.dialogConfirmVisible = true
    },
    passLeader() {
      updateSG(this.temp).then(() => {
        this.$store.dispatch('sg/getSGInfo').then(() => {
          this.dialogConfirmVisible = false
          this.getList()
          this.$notify({
            title: '操作成功',
            message: '成功更新用户信息',
            type: 'success',
            duration: 2000
          })
          this.resetTemp()
        })
      })
    },
    handleRemove(row) {
      this.temp = Object.assign({}, row)
      this.temp.courseId = this.course.id
      this.temp.groupId = this.sg.groupId
      this.dialogStatus = 'remove'
      this.dialogConfirmVisible = true
    },
    removeMember() {
      deleteSG(this.temp).then(() => {
        this.dialogConfirmVisible = false
        this.getList()
        this.$notify({
          title: '操作成功',
          message: '成功更新用户信息',
          type: 'success',
          duration: 2000
        })
        this.resetTemp()
      })
    }
  }
}
</script>
