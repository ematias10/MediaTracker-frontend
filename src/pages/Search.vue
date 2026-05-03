<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Explorar</h1>
    
    <div class="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <TabMenu :model="items" v-model:activeIndex="activeTab" class="mb-6" />
      
      <div class="flex gap-2">
        <InputText 
          v-model="searchQuery" 
          :placeholder="activeTab === 0 ? 'Buscar álbumes en Spotify...' : 'Buscar películas en TMDb...'" 
          class="flex-1 w-full p-inputtext-lg"
          @keyup.enter="performSearch"
        />
        <Button icon="pi pi-search" label="Buscar" size="large" @click="performSearch" :loading="isSearching" />
      </div>
    </div>
    
    <div v-if="error" class="p-4 mb-6 bg-red-100 text-red-700 rounded-lg shadow-sm">
      <i class="pi pi-exclamation-triangle mr-2"></i> {{ error }}
    </div>

    <div v-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <MediaCard 
        v-for="item in results" 
        :key="item.id" 
        :item="item" 
        :type="activeType"
        :loading="addingId === item.id"
        @add="addToCatalog"
      />
    </div>
    
    <div v-else-if="hasSearched && !isSearching" class="text-center text-gray-500 py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <i class="pi pi-inbox text-4xl mb-4 text-gray-300"></i>
      <p>No se encontraron resultados para "{{ lastQuery }}".</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TabMenu from 'primevue/tabmenu';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import MediaCard from '../components/MediaCard.vue';
import api from '../services/api'; 
import { useToast } from 'primevue/usetoast';
import { useGroupStore } from '../stores/group';

const toast = useToast();
const groupStore = useGroupStore();

const activeTab = ref(0);
const items = ref([
    { label: 'Música', icon: 'pi pi-fw pi-volume-up' },
    { label: 'Películas', icon: 'pi pi-fw pi-video' }
]);

const searchQuery = ref('');
const lastQuery = ref('');
const isSearching = ref(false);
const hasSearched = ref(false);
const results = ref([]);
const error = ref(null);
const addingId = ref(null);

const activeType = computed(() => activeTab.value === 0 ? 'music' : 'movie');

// Reset search when tab changes
watch(activeTab, () => {
    results.value = [];
    hasSearched.value = false;
    error.value = null;
    searchQuery.value = '';
});

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  isSearching.value = true;
  error.value = null;
  results.value = [];
  lastQuery.value = searchQuery.value;
  
  try {
    const endpoint = activeTab.value === 0 ? '/search/music/' : '/search/movies/';
    const response = await api.get(endpoint, { 
      params: { 
        q: searchQuery.value,
        group_id: groupStore.activeGroupId 
      } 
    });
    results.value = response.data;
    hasSearched.value = true;
  } catch (err) {
    error.value = err.response?.data?.error || 'Ocurrió un error al realizar la búsqueda.';
    console.error(err);
  } finally {
    isSearching.value = false;
  }
};

const addToCatalog = async (item) => {
  addingId.value = item.id;
  try {
    if (!groupStore.activeGroupId) {
      toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Selecciona un grupo primero.', life: 3000 });
      return;
    }
    
    const endpoint = activeTab.value === 0 
      ? `/groups/${groupStore.activeGroupId}/albums/` 
      : `/groups/${groupStore.activeGroupId}/movies/`;
      
    const payload = activeTab.value === 0 ? { spotify_id: item.id } : { tmdb_id: item.id };
    
    await api.post(endpoint, payload);
    toast.add({ severity: 'success', summary: 'Éxito', detail: '¡Agregado al catálogo del grupo!', life: 3000 });
    // Refresh local state to disable button
    item.already_in_group = true;
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar al catálogo: ' + (err.response?.data?.error || err.message), life: 5000 });
  } finally {
    addingId.value = null;
  }
};
</script>
