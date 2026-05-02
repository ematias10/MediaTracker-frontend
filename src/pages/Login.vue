<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Usuario o contraseña incorrectos.';
    } else {
      error.value = 'Error al intentar iniciar sesión. Intenta más tarde.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg-dark">
    <div class="w-full max-w-md bg-surface-dark rounded-2xl shadow-xl p-8 border border-slate-700/50">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-100 mb-2">Media Tracker</h1>
        <p class="text-slate-400">Bienvenido de vuelta</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
          <input v-model="username" type="text" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Ingresa tu usuario" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
          <input v-model="password" type="password" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="••••••••" />
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20">
          <span v-if="loading">Iniciando...</span>
          <span v-else>Iniciar sesión</span>
        </button>

        <p class="text-center text-sm text-slate-400 mt-6">
          ¿No tienes una cuenta? 
          <router-link to="/register" class="text-primary hover:text-primary-dark font-medium hover:underline transition-colors">Solicita acceso</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
