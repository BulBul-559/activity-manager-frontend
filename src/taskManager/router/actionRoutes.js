const actionRoutes = [
  {
    path: '/execute-activity/:activityId',
    name: 'execute-activity',
    components: {
      MainComponment: () => import('actionPage/ExecuteActivity.vue')
    }
  }
]

export default actionRoutes
