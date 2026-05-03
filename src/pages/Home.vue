<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8">
    <div v-if="groups.length === 0" class="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
      <h2 class="text-2xl font-bold text-gray-600 dark:text-gray-300">¡Bienvenido! Crea tu primer grupo</h2>
      <p class="text-gray-500 mt-2 mb-8">Necesitas un grupo (ej: Familia, Amigos, o Personal) para empezar a trackear contenido.</p>
      
      <div class="max-w-md mx-auto flex gap-2">
        <InputText v-model="newGroupName" placeholder="Nombre del grupo (ej: Mi Lista)" class="flex-1" @keyup.enter="handleCreateGroup" />
        <Button label="Crear Grupo" @click="handleCreateGroup" :loading="creatingGroup" />
      </div>
    </div>
    
    <div v-else-if="!activeGroupId" class="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
      <h2 class="text-2xl font-bold text-gray-600 dark:text-gray-300">No has seleccionado ningún grupo</h2>
      <p class="text-gray-500 mt-2">Selecciona un grupo en la barra de navegación superior.</p>
    </div>
    
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Dashboard del Grupo</h1>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <TabMenu :model="tabItems" v-model:activeIndex="activeTab" />
        
        <div class="p-6">
          <div class="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button 
              @click="statusFilter = 'pending'" 
              :class="['px-4 py-2 font-medium rounded-lg transition-colors', statusFilter === 'pending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700']"
            >
              Pendientes
            </button>
            <button 
              @click="statusFilter = 'completed'" 
              :class="['px-4 py-2 font-medium rounded-lg transition-colors', statusFilter === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700']"
            >
              Completados / Vistos
            </button>
          </div>
          
          <div v-if="loading" class="flex justify-center py-12">
            <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
          </div>
          
          <div v-else-if="filteredItems.length === 0" class="text-center text-gray-500 py-12">
            <i class="pi pi-inbox text-4xl mb-4 text-gray-300"></i>
            <p>No hay elementos {{ statusFilter === 'pending' ? 'pendientes' : 'completados' }} en esta sección.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <DashboardCard 
              v-for="item in filteredItems" 
              :key="item.id" 
              :item="item" 
              :type="activeType"
              :status="statusFilter"
              @complete="openReviewDialog"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dialog for Review -->
    <Dialog v-model:visible="reviewDialogVisible" modal header="¡Felicidades! Deja tu reseña" :style="{ width: '30vw' }" breakpoints="{ '1199px': '50vw', '575px': '90vw' }">
      <div class="flex flex-col gap-4 py-4">
        <p class="text-gray-600 dark:text-gray-300">Califica "{{ selectedItemTitle }}" y deja un comentario para tu grupo.</p>
        
        <div class="flex items-center gap-3">
          <span class="font-medium dark:text-white">Tu Calificación:</span>
          <Rating v-model="reviewRating" :cancel="false" />
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="comment" class="font-medium dark:text-white">Comentario (opcional):</label>
          <Textarea id="comment" v-model="reviewComment" rows="4" class="w-full" placeholder="¿Qué te pareció?" />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="closeReviewDialog" />
        <Button label="Guardar y Completar" icon="pi pi-check" severity="success" @click="submitReviewAndComplete" :loading="submittingReview" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useGroupStore } from '../stores/group';
import api from '../services/api';
import TabMenu from 'primevue/tabmenu';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DashboardCard from '../components/DashboardCard.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const groupStore = useGroupStore();
const groups = computed(() => groupStore.groups);
const activeGroupId = computed(() => groupStore.activeGroupId);

const newGroupName = ref('');
const creatingGroup = ref(false);

const handleCreateGroup = async () => {
  if (!newGroupName.value.trim()) return;
  creatingGroup.value = true;
  try {
    await groupStore.createGroup(newGroupName.value);
    newGroupName.value = '';
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado correctamente', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el grupo', life: 3000 });
  } finally {
    creatingGroup.value = false;
  }
};

const tabItems = ref([
    { label: 'Música', icon: 'pi pi-fw pi-volume-up' },
    { label: 'Películas', icon: 'pi pi-fw pi-video' }
]);
const activeTab = ref(0);
const activeType = computed(() => activeTab.value === 0 ? 'music' : 'movie');

const statusFilter = ref('pending');
const items = ref([]);
const loading = ref(false);

const filteredItems = computed(() => items.value.filter(i => i.status === statusFilter.value));

const fetchItems = async () => {
  if (!activeGroupId.value) return;
  
  loading.value = true;
  try {
    const endpoint = activeTab.value === 0 
      ? `/groups/${activeGroupId.value}/albums/` 
      : `/groups/${activeGroupId.value}/movies/`;
      
    const response = await api.get(endpoint);
    items.value = response.data;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los elementos del grupo', life: 3000 });
  } finally {
    loading.value = false;
  }
};

watch([activeGroupId, activeTab], () => {
  fetchItems();
});

onMounted(() => {
  if (activeGroupId.value) {
    fetchItems();
  }
});

// Review Logic
const reviewDialogVisible = ref(false);
const selectedItem = ref(null);
const reviewRating = ref(5);
const reviewComment = ref('');
const submittingReview = ref(false);

const selectedItemTitle = computed(() => {
  if (!selectedItem.value) return '';
  return activeType.value === 'music' ? selectedItem.value.album.title : selectedItem.value.movie.title;
});

const openReviewDialog = (item) => {
  selectedItem.value = item;
  reviewRating.value = 5;
  reviewComment.value = '';
  reviewDialogVisible.value = true;
};

const closeReviewDialog = () => {
  reviewDialogVisible.value = false;
  selectedItem.value = null;
};

const submitReviewAndComplete = async () => {
  submittingReview.value = true;
  try {
    // 1. Submit review
    const targetId = activeType.value === 'music' ? selectedItem.value.album.id : selectedItem.value.movie.id;
    const payload = {
      rating: reviewRating.value,
      comment: reviewComment.value
    };
    if (activeType.value === 'music') payload.album_id = targetId;
    else payload.movie_id = targetId;
    
    await api.post('/reviews/', payload);
    
    // 2. Mark as completed
    const completeEndpoint = activeType.value === 'music' 
      ? `/groups/albums/${selectedItem.value.id}/complete/`
      : `/groups/movies/${selectedItem.value.id}/complete/`;
      
    await api.patch(completeEndpoint);
    
    toast.add({ severity: 'success', summary: 'Completado', detail: '¡Completado y reseña guardada!', life: 3000 });
    closeReviewDialog();
    fetchItems(); // Refresh list
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar: ' + (error.response?.data?.error || ''), life: 5000 });
  } finally {
    submittingReview.value = false;
  }
};
</script>
