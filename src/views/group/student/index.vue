<template>
  <div v-loading="tabsLoading" class="tab-container">
    <el-tabs v-model="sg.activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-if="sg.openGroupList" label="小组列表" name="小组列表">
        <group-list />
      </el-tab-pane>
      <el-tab-pane v-if="sg.hasJoinedGroup" label="我的小组" name="我的小组">
        <my-group />
      </el-tab-pane>
      <el-tab-pane v-if="sg.isLeader" label="小组管理" name="小组管理">
        <group-management />
      </el-tab-pane>
      <el-tab-pane v-if="sg.isLeader" label="题目列表" name="题目列表">
        <topic-list />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { GroupList, GroupManagement, MyGroup, TopicList } from './components'
import { mapGetters } from 'vuex'

export default {
  name: 'Group',
  components: {
    GroupList,
    GroupManagement,
    MyGroup,
    TopicList
  },
  data() {
    return {
      tabsLoading: true
    }
  },
  computed: {
    ...mapGetters([
      'course',
      'user',
      'sg'
    ])
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.tabsLoading = true
      this.$store.dispatch('sg/getSGInfo').then(() => {
        this.tabsLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
