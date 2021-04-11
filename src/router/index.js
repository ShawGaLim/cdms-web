import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management/student/list',
    name: 'UserManagement',
    meta: { title: '用户管理', icon: 'el-icon-user', breadcrumb: false, roles: ['管理员'] },
    children: [
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/user/student/index'),
        meta: { title: '学生管理', icon: 'el-icon-user-solid', breadcrumb: false },
        children: [
          {
            path: 'list',
            name: 'StudentList',
            component: () => import('@/views/user/student/list'),
            meta: { title: '学生列表', icon: 'el-icon-tickets' }
          },
          {
            path: 'import',
            name: 'StudentImport',
            component: () => import('@/views/user/student/import'),
            meta: { title: '学生导入', icon: 'el-icon-document-add' }
          }
        ]
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('@/views/user/teacher/index'),
        meta: { title: '教师管理', icon: 'el-icon-s-custom', breadcrumb: false },
        children: [
          {
            path: 'list',
            name: 'TeacherList',
            component: () => import('@/views/user/teacher/list'),
            meta: { title: '教师列表', icon: 'el-icon-tickets' }
          },
          {
            path: 'import',
            name: 'TeacherImport',
            component: () => import('@/views/user/teacher/import'),
            meta: { title: '教师导入', icon: 'el-icon-document-add' }
          }
        ]
      }
    ]
  },

  {
    path: '/course-management',
    component: Layout,
    redirect: '/dashboard',
    name: 'CourseManagement',
    meta: { title: '课程管理', icon: 'el-icon-reading', breadcrumb: false, roles: ['管理员'] },
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/course/list'),
        meta: { title: '课程列表', icon: 'el-icon-tickets' }
      },
      {
        path: 'import',
        name: 'CourseImport',
        component: () => import('@/views/course/import'),
        meta: { title: '课程导入', icon: 'el-icon-document-add' }
      }
    ]
  },

  {
    path: '/sc-management',
    component: Layout,
    redirect: '/dashboard',
    name: 'SCManagement',
    meta: { title: '选课管理', icon: 'el-icon-school', breadcrumb: false, roles: ['管理员'] },
    children: [
      {
        path: 'list',
        name: 'SCList',
        component: () => import('@/views/sc/list'),
        meta: { title: '选课列表', icon: 'el-icon-tickets' }
      },
      {
        path: 'import',
        name: 'SCImport',
        component: () => import('@/views/sc/import'),
        meta: { title: '选课导入', icon: 'el-icon-document-add' }
      }
    ]
  },

  {
    path: '/group-management',
    component: Layout,
    redirect: '/dashboard',
    name: 'GroupManagement',
    children: [
      {
        path: 'teacher-page',
        name: 'GroupManagementTeacher',
        component: () => import('@/views/group/teacher/index'),
        meta: { title: '小组管理', icon: 'peoples', roles: ['教师'] }
      },
      {
        path: 'student-page',
        name: 'Student-Group',
        component: () => import('@/views/group/student/index'),
        meta: { title: '课设小组', icon: 'peoples', roles: ['学生'] }
      }
    ]
  },

  {
    path: '/topic-management',
    component: Layout,
    redirect: '/dashboard',
    name: 'TopicManagement',
    meta: { title: '选题管理', icon: 'list', breadcrumb: false, roles: ['教师'] },
    children: [
      {
        path: 'list',
        name: 'TopicList',
        component: () => import('@/views/topic/list'),
        meta: { title: '题目列表', icon: 'el-icon-tickets' }
      },
      {
        path: 'import',
        name: 'TopicImport',
        component: () => import('@/views/topic/import'),
        meta: { title: '题目导入', icon: 'el-icon-document-add' }
      }
    ]
  },

  {
    path: '/homework',
    component: Layout,
    redirect: '/homework/publish',
    name: 'Homework',
    meta: { title: '作业管理', icon: 'el-icon-reading', breadcrumb: false, roles: ['教师'] },
    children: [
      {
        path: 'publish',
        name: 'HomeworkPublish',
        hidden: true,
        component: () => import('@/views/homework/index'),
        meta: { title: '发布作业', icon: 'el-icon-reading', roles: ['教师'] }
      },
      {
        path: 'submit-list/:homeworkId',
        name: 'HomeworkSubmitList',
        hidden: true,
        component: () => import('@/views/homework/submit/SubmitList'),
        meta: { title: '提交情况', roles: ['教师'] }
      },
      {
        path: 'student-submit/:homeworkId-:groupId',
        name: 'StudentSubmit',
        hidden: true,
        component: () => import('@/views/homework/submit/StudentHomework'),
        meta: { title: '学生作业', roles: ['教师'] }
      }
    ]
  },

  {
    path: '/s-homework',
    component: Layout,
    redirect: '/s-homework/list',
    name: 'StudentHomework',
    meta: { title: '课程作业', icon: 'el-icon-reading', breadcrumb: false, roles: ['学生'] },
    children: [
      {
        path: 'list',
        name: 'StudentHomeworkList',
        hidden: true,
        component: () => import('@/views/sh/index'),
        meta: { title: '已发布作业', icon: 'el-icon-reading' }
      },
      {
        path: 'submit-page/:homeworkId',
        name: 'StudentHomeworkSubmitPage',
        hidden: true,
        component: () => import('@/views/sh/submit/SubmitPage'),
        meta: { title: '作业提交', icon: 'el-icon-reading' }
      }
    ]
  },

  {
    path: '/grade-management',
    component: Layout,
    redirect: '/grade-management/reply-grade-import',
    name: 'GradeManagement',
    meta: { title: '成绩管理', icon: 'el-icon-document-checked', breadcrumb: false, roles: ['教师'] },
    children: [
      {
        path: 'total-grade',
        name: 'TotalGrade',
        component: () => import('@/views/grade/TotalGrade'),
        meta: { title: '成绩管理', icon: 'el-icon-document-checked' }
      }
    ]
  },

  {
    path: '/student-grade',
    component: Layout,
    redirect: '/student-grade/my-grade',
    name: 'StudentGrade',
    meta: { title: '我的成绩', icon: 'el-icon-document-checked', breadcrumb: false, roles: ['学生'] },
    children: [
      {
        path: 'my-grade',
        name: 'MyGrade',
        component: () => import('@/views/grade/MyGrade'),
        meta: { title: '我的成绩', icon: 'el-icon-document-checked' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
