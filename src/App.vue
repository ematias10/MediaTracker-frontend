<script setup>
// App.vue es el punto de entrada principal.
// Vue Router se encargará de inyectar las vistas (Home, Login, Register) dinámicamente aquí.
import { Toaster } from 'vue-sonner';
</script>

<template>
  <Toaster position="top-right" richColors closeButton />
  <router-view></router-view>
</template>

<style>
/* Los estilos globales viven en style.css (Tailwind) */
</style>
