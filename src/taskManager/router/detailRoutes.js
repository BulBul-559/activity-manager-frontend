const detailRoutes = [
  {
    path: '/single-machine/:machineId',
    name: 'single-machine',
    components: {
      MainComponment: () => import('detailPage/SingleMachine.vue')
    }
  },
  {
    path: '/activity-detail/:activityId',
    name: 'activity-detail',
    components: {
      MainComponment: () => import('detailPage/ActivityDetail.vue')
    },
    children: [
      {
        // 当 /user/:id/ 匹配成功?
        // 将被渲染到 父组件 的 <router-view> 内部
        path: '',
        component: () => import('manager/components/activity/AllActivityEntry.vue')
      },
      {
        // 当 /user/:id/ 匹配成功?
        // 将被渲染到 父组件 的 <router-view> 内部
        path: 'entry',
        component: () => import('manager/components/activity/AllActivityEntry.vue')
      },
      {
        // 当 /user/:id/analysis 匹配成功
        // 将被渲染到 父组件 的 <router-view> 内部
        path: 'analysis',
        name: 'activityDetail',
        component: () => import('manager/components/activity/ActivityAnalysis.vue')
      }
    ]
  }
]

export default detailRoutes
