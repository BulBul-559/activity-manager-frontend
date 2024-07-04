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
    }
  }
]

export default detailRoutes
