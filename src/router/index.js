import Map from '../components/Map.vue';
import { createRouter, createWebHistory } from 'vue-router';//和vue2 路由不同
const routerHistory = createWebHistory();

const router = createRouter({
  history: routerHistory,//history写法不同
  routes: [
    {
      path: '/',
      component: Map,
    },
  ],
});

export default router;