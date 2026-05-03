<template>
  <header class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 mx-4 md:mx-auto max-w-7xl mt-4">
    <div class="flex items-center gap-6">
      <router-link to="/" class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
        Media Tracker
      </router-link>
      <nav class="hidden md:flex gap-4">
        <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500" active-class="text-blue-600 font-bold">Dashboard</router-link>
        <router-link to="/search" class="text-gray-600 dark:text-gray-300 hover:text-blue-500" active-class="text-blue-600 font-bold">Buscar</router-link>
      </nav>
    </div>
    
    <div class="flex items-center gap-4">
      <Dropdown 
        v-model="activeGroup" 
        :options="groups" 
        optionLabel="name" 
        optionValue="id"
        placeholder="Seleccionar Grupo" 
        class="w-48"
        :loading="loadingGroups"
      />
      <button @click="handleLogout" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
        Salir
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useGroupStore } from '../stores/group';
import { useRouter } from 'vue-router';
import Dropdown from 'primevue/dropdown';

const authStore = useAuthStore();
const groupStore = useGroupStore();
const router = useRouter();

const groups = computed(() => groupStore.groups);
const loadingGroups = computed(() => groupStore.loading);

const activeGroup = computed({
  get: () => groupStore.activeGroupId,
  set: (val) => groupStore.setActiveGroup(val)
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    groupStore.fetchGroups();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
