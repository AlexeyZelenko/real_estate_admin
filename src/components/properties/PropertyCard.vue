<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Property } from '../../types/property'

const props = defineProps<{
  property: Property
}>()

const router = useRouter()

const viewProperty = () => {
  router.push(`/properties/${props.property.id}`)
}

const editProperty = (e: Event) => {
  e.stopPropagation()
  router.push(`/properties/${props.property.id}/edit`)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'sold':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer" 
    @click="viewProperty"
  >
    <div class="relative h-48">
      <img 
        v-if="property.images && property.images.length > 0"
        :src="property.images[0]" 
        :alt="property.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <i class="pi pi-image text-4xl text-gray-400 dark:text-gray-500"></i>
      </div>
      
      <!-- Featured badge -->
      <div v-if="property.featured" class="absolute top-0 left-0 m-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-md">
        Премиум
      </div>
      
      <!-- Status badge -->
      <div class="absolute top-0 right-0 m-2 text-xs px-2 py-1 rounded-md" :class="getStatusClass(property.status)">
        {{ property.status === 'active' ? 'Активно' : 
           property.status === 'pending' ? 'В ожидании' : 
           property.status === 'sold' ? 'Продано' : 'Архив' }}
      </div>
      
      <!-- Edit button -->
      <button 
        @click="editProperty"
        class="absolute bottom-0 right-0 m-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <i class="pi pi-pencil text-gray-700 dark:text-gray-300"></i>
      </button>
    </div>
    
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {{ property.title }}
        </h3>
      </div>
      
      <p class="mt-1 text-xl font-bold text-primary-600 dark:text-primary-400">
        {{ formatPrice(property.price) }}
      </p>
      
      <div class="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <i class="pi pi-map-marker mr-1"></i>
        <span class="truncate">{{ property.address?.city }}, {{ property.address?.street }}</span>
      </div>
      
      <div class="mt-4 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
        <div class="flex items-center">
          <i class="pi pi-th-large text-gray-400 mr-1"></i>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ property.details?.area }} м²
          </span>
        </div>
        
        <div v-if="property.details?.rooms" class="flex items-center">
          <i class="pi pi-home text-gray-400 mr-1"></i>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ property.details.rooms }} комн.
          </span>
        </div>
        
        <div v-if="property.details?.floor && property.details?.floors" class="flex items-center">
          <i class="pi pi-sort text-gray-400 mr-1"></i>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ property.details.floor }}/{{ property.details.floors }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>