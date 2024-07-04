const manageRoutes = [
    {
        path: '/',
        name: 'home',
        components: {
            MainComponment: () => import('managePage/MachineManage.vue')
        }
    },
    {
        path: '/activity-manage',
        name: 'activity-manage',
        components: {
            MainComponment: () => import('managePage/ActivityManage.vue')
        }
    },
    {
        path: '/machine-manage',
        name: 'machine-manage',
        components: {
            MainComponment: () => import('managePage/MachineManage.vue')
        }
    },
    {
        path: '/member-manage',
        name: 'member-manage',
        components: {
            MainComponment: () => import('managePage/MemberManage.vue')
        }
    },
    {
        path: '/self-manage',
        name: 'self-manage',
        components: {
            MainComponment: () => import('managePage/SelfManage.vue')
        }
    }
];

export default manageRoutes;