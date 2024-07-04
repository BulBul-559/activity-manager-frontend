import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes'; // 导入合并后的路由配置

const router = createRouter({
  history: createWebHashHistory(),
  routes // 使用合并后的路由配置
});

export default router;
