import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Editor from '../pages/Editor.vue';
import Preview from '../pages/Preview.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/editor/:id?', component: Editor, meta: { requiresAuth: true } },
  { path: '/p/:slug', component: Preview }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
