<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div class="h-48 overflow-hidden relative bg-gray-100 dark:bg-gray-900">
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="pi pi-image text-4xl text-gray-400"></i>
      </div>
      <div v-if="status === 'completed'" class="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md">
        Completado
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="font-bold text-lg truncate mb-1 dark:text-white" :title="title">{{ title }}</h3>
      <div class="flex justify-between items-center mb-3">
        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ description }}</p>
        <span v-if="year" class="text-xs font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{{ year }}</span>
      </div>
      
      <div class="flex items-center text-xs text-gray-400 mb-4">
        <i class="pi pi-user mr-1"></i> Añadido por {{ item.added_by_name }}
      </div>
      
      <Button 
        v-if="status === 'pending'"
        label="Completar y Reseñar" 
        icon="pi pi-check-circle" 
        class="w-full p-button-sm" 
        severity="success" 
        @click="$emit('complete', item)" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String, // 'music' or 'movie'
    required: true
  },
  status: {
    type: String, // 'pending' or 'completed'
    required: true
  }
});

defineEmits(['complete']);

const target = computed(() => props.type === 'music' ? props.item.album : props.item.movie);

const title = computed(() => target.value.title);

const description = computed(() => {
  return props.type === 'music' ? target.value.artist?.name : '';
});

const year = computed(() => {
  const dateStr = target.value.release_date;
  if (!dateStr) return '';
  return dateStr.substring(0, 4);
});

const imageUrl = computed(() => {
  if (props.type === 'music') {
    return target.value.cover_url;
  } else {
    return target.value.poster_url;
  }
});
</script>
