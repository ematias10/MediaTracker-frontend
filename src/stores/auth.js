import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const accessToken = ref(localStorage.getItem('access_token') || null);
  const refreshToken = ref(localStorage.getItem('refresh_token') || null);

  const isAuthenticated = computed(() => !!accessToken.value);

  function setTokens(access, refresh) {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  function clearSession() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async function login(username, password) {
    const response = await api.post('/auth/login/', { username, password });
    setTokens(response.data.access, response.data.refresh);
    // Ideally we would decode JWT or fetch user profile here. 
    user.value = { username }; // Placeholder until we have a /me endpoint
    return response;
  }

  async function register(userData) {
    const response = await api.post('/auth/register/', userData);
    setTokens(response.data.access, response.data.refresh);
    user.value = response.data.user;
    return response;
  }

  function logout() {
    clearSession();
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    register,
    logout
  };
});
