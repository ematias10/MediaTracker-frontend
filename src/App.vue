<script setup>
// App.vue es el punto de entrada principal.
// Vue Router se encargará de inyectar las vistas (Home, Login, Register) dinámicamente aquí.
// import { Toaster } from 'vue-sonner'; // Switching to PrimeVue Toast
import Toast from 'primevue/toast';
import { useAuthStore } from './stores/auth';
import Navbar from './components/Navbar.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="app-container">
    <Toast />
    <Navbar v-if="authStore.isAuthenticated" />
    <router-view></router-view>
  </div>
</template>

<style>
/* Los estilos globales viven en style.css (Tailwind) */
.p-toast {
  z-index: 999999 !important;
}
</style>
