import manageRoutes from './manageRoutes'
import detailRoutes from './detailRoutes' // 新增导入detailRoutes
import actionRoutes from './actionRoutes'

// 将所有路由配置合并为一个数组
export default [...manageRoutes, ...detailRoutes, ...actionRoutes]
