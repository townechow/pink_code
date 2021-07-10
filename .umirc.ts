import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/template/index/', component: '@/pages/template/index' },
    { path: '/template/form/', component: '@/pages/template/form' },
    { path: '/template/antdTableHook/', component: '@/pages/template/antdTableHook' },
    { path: '/editTable/', component: '@/pages/editTable' },
  ],
  fastRefresh: {},
});
