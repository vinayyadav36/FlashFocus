import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token') || '');

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(userData: any, userToken: string) {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return { user, token, isAuthenticated, setAuth, logout };
});
