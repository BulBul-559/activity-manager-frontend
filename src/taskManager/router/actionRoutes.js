const actionRoutes = [
  {
    path: '/execute-activity',
    name: 'execute-activity',
    components: {
      MainComponment: () => import('actionPage/ExecuteActivity.vue')
    }
  }
]

export default actionRoutes
