<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Property } from '../../types/property'

const props = defineProps<{
  properties: Property[]
}>()

const router = useRouter()

const viewProperty = (id: string) => {
  router.push(`/properties/${id}`)
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
  <div class="overflow-hidden">
    <div v-if="properties.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
      У вас пока нет объектов недвижимости
    </div>
    <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <li v-for="property in properties" :key="property.id" 
        class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
        @click="viewProperty(property.id)"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
            <img 
              v-if="property.images && property.images.length > 0" 
              :src="property.images[0]" 
              :alt="property.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <i class="pi pi-image text-gray-400 dark:text-gray-500"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ property.title }}
            </p>
            <div class="flex items-center mt-1">
              <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(property.status)">
                {{ property.status === 'active' ? 'Активно' : 
                   property.status === 'pending' ? 'В ожидании' : 
                   property.status === 'sold' ? 'Продано' : 'Архив' }}
              </span>
              <span class="mx-2 text-gray-300 dark:text-gray-600">|</span>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ property.category }} / {{ property.subcategory }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ formatPrice(property.price) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ property.address?.city || 'N/A' }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>