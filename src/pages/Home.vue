<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-bg-dark text-slate-100 p-8">
    <div class="max-w-4xl mx-auto">
      <header class="flex justify-between items-center bg-surface-dark p-6 rounded-2xl shadow-xl border border-slate-700/50 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Media Tracker</h1>
          <p class="text-slate-400 text-sm mt-1">Bienvenido al Dashboard</p>
        </div>
        
        <button @click="handleLogout" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-all text-sm font-medium">
          Cerrar Sesión
        </button>
      </header>
      
      <div class="bg-surface-dark border border-slate-700/50 rounded-2xl p-8 shadow-xl text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Tu Catálogo está Vacío</h2>
        <p class="text-slate-400 mb-6">Pronto agregaremos funcionalidades para explorar películas y álbumes.</p>
        <button class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all font-medium">
          Explorar Catálogo
        </button>
      </div>
    </div>
  </div>
</template>
