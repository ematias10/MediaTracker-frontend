<template>
  <Card class="w-full shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <template #header>
      <div class="h-64 overflow-hidden bg-gray-200 flex items-center justify-center relative">
        <img v-if="imageUrl" :src="imageUrl" :alt="title" class="w-full h-full object-cover" />
        <i v-else class="pi pi-image text-4xl text-gray-400"></i>
      </div>
    </template>
    <template #title>
      <div class="truncate text-lg font-bold" :title="title">{{ title }}</div>
    </template>
    <template #subtitle>
      <div class="text-sm text-gray-500">{{ year || 'Año desconocido' }}</div>
    </template>
    <template #content>
      <div class="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
        {{ description }}
      </div>
    </template>
    <template #footer>
      <Button 
        :label="item.already_in_group ? 'Ya en el catálogo' : 'Agregar al Catálogo'" 
        :icon="item.already_in_group ? 'pi pi-check' : 'pi pi-plus'" 
        class="w-full" 
        :severity="item.already_in_group ? 'secondary' : 'primary'" 
        @click="$emit('add', item)" 
        :loading="loading"
        :disabled="item.already_in_group"
      />
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String, // 'music' or 'movie'
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['add']);

const title = computed(() => props.type === 'music' ? props.item.name : props.item.title);

const description = computed(() => {
  if (props.type === 'music') {
    return props.item.artists?.map(a => a.name).join(', ') || '';
  } else {
    return props.item.overview || '';
  }
});

const year = computed(() => {
  const dateStr = props.type === 'music' ? props.item.release_date : props.item.release_date;
  if (!dateStr) return '';
  return dateStr.substring(0, 4);
});

const imageUrl = computed(() => {
  if (props.type === 'music') {
    return props.item.images?.[0]?.url || null;
  } else {
    return props.item.poster_path ? `https://image.tmdb.org/t/p/w500${props.item.poster_path}` : null;
  }
});
</script>
