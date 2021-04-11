<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" :offset="2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>小组信息</span>
            <el-button style="float: right" type="danger" size="mini" @click="sg.isLeader ? handleDissolve() : handleLeave()">
              {{ sg.isLeader ? '解散小组' : '离开小组' }}
            </el-button>
          </div>
          <el-form v-loading="infoLoading" label-position="right" label-width="70px">
            <el-form-item label="小组编号">
              <el-tag type="info">{{ sg.groupId }}</el-tag>
            </el-form-item>
            <el-form-item label="小组名">
              <el-tag>{{ groupName }}</el-tag>
            </el-form-item>
            <el-form-item label="小组人数">
              <el-tag>{{ groupSize }} 人</el-tag>
            </el-form-item>
            <el-form-item label="组长">
              <el-tag>{{ groupLeader }}</el-tag>
            </el-form-item>
            <el-form-item label="组员">
              <el-tag>{{ groupMember.toString() }}</el-tag>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>题目信息</span>
          </div>
          <el-form v-if="topicName!==''" v-loading="infoLoading" label-position="top" label-width="100px">
            <el-form-item label="题名">
              <el-tag>{{ topicName }}</el-tag>
            </el-form-item>
            <el-form-item label="题目要求">
              <span style="white-space: pre-wrap;">{{ topicContent }}</span>
            </el-form-item>
          </el-form>
          <span v-if="topicName===''">未选题</span>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" center width="20%">
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="sg.isLeader ? DissolveGroup() : LeaveGroup()">
          确认
        </el-button>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGroup, deleteGroup } from '@/api/group'
import { getGroupSGs, deleteSG } from '@/api/sg'
import { getTopic } from '@/api/topic'
import { mapGetters } from 'vuex'

export default {
  name: 'MyGroup',
  data() {
    return {
      groupName: '',
      groupLeader: '',
      groupMember: '',
      groupSize: '',
      infoLoading: true,
      topicName: '',
      topicContent: '',
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        dissolve: '解散小组操作确认',
        leave: '离开小组操作确认'
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
    if (this.sg.hasJoinedGroup) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      this.infoLoading = true
      const temp = {
        courseId: this.course.id,
        groupId: this.sg.groupId,
        id: this.sg.groupId
      }
      getGroup(temp).then((response) => {
        this.groupName = response.group.name
        this.groupSize = response.group.member
        if (response.group.topic !== null) {
          getTopic(response.group.topic.id).then((response) => {
            this.topicName = response.topic.name
            this.topicContent = response.topic.content
          })
        }
        getGroupSGs(temp).then((response) => {
          const tempList = response.data.items
          this.groupMember = tempList.map(e => {
            if (e.identity === '组长') {
              this.groupLeader = e.student.username
            } else {
              return e.student.username
            }
          })
          this.groupMember.splice(this.groupMember.indexOf('null'), 1)
          this.infoLoading = false
        })
      })
    },
    handleDissolve() {
      this.dialogStatus = 'dissolve'
      this.dialogVisible = true
    },
    DissolveGroup() {
      const temp = {
        courseId: this.course.id,
        id: this.sg.groupId
      }
      deleteGroup(temp).then(() => {
        this.$store.dispatch('sg/getSGInfo')
      })
    },
    handleLeave() {
      this.dialogStatus = 'leave'
      this.dialogVisible = true
    },
    LeaveGroup() {
      const temp = {
        courseId: this.course.id,
        groupId: this.sg.groupId,
        student: {
          id: this.user.id
        }
      }
      deleteSG(temp).then(() => {
        this.$store.dispatch('sg/getSGInfo')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 3px;
}
.clearfix {
  text-align: center;
}
</style>
