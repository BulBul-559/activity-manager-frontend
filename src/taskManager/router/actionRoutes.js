const actionRoutes = [
    {
        path: '/execute-activity',
        name: 'execute-activity',
        components: {
            MainComponment: () => import('actionPage/ExecuteActivity.vue')
        }
    },
    {
        path: '/add-activity/',
        name: 'add-activity',
        components: {
            MainComponment: () => import('actionPage/AddNewActivity.vue')
        }
    }
];

export default actionRoutes;