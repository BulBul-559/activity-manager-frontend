import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        MainComponment: () => import('managePage/MachineManage.vue')
      }
    },
    {
      path: '/ActivityManage',
      name: 'activity-manage',
      components: {
        MainComponment: () => import('managePage/ActivityManage.vue')
      }
    },
    {
      path: '/MachineManage',
      name: 'machine-manage',
      components: {
        MainComponment: () => import('managePage/MachineManage.vue')
      }
    },
    {
      path: '/MemberManage',
      name: 'member-manage',
      components: {
        MainComponment: () => import('managePage/MemberManage.vue')
      }
    },
    {
      path: '/SelfManage',
      name: 'self-manage',
      components: {
        MainComponment: () => import('managePage/SelfManage.vue')
      }
    },
    {
      path: '/MachineBorrow',
      name: 'machine-borrow',
      components: {
        MainComponment: () => import('actionPage/MachineBorrow.vue')
      }
    },
    {
      path: '/ExecuteActivity',
      name: 'execute-activity',
      components: {
        MainComponment: () => import('actionPage/ExecuteActivity.vue')
      }
    }
  ]
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = true // 替换为你的身份验证逻辑

//   if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
//     // 如果需要身份验证且用户未登录，则重定向到登录页
//     next({ path: '/' })
//   } else if (isAuthenticated && to.path === '/') {
//     // 如果用户已登录且尝试访问登录页，则重定向到仪表板页
//     next({ path: '/' })
//   } else {
//     // 其他情况允许导航
//     next()
//   }
// })

export default router
