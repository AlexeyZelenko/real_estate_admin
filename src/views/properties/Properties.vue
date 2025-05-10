<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { usePropertiesStore } from '../../stores/properties'
import PropertyCard from '../../components/properties/PropertyCard.vue'
import PropertyFilter from '../../components/properties/PropertyFilter.vue'
import type { PropertyFilter as FilterType } from '../../types/property'

const router = useRouter()
const userStore = useUserStore()
const propertiesStore = usePropertiesStore()

const isLoading = ref(true)
const currentView = ref('grid') // 'grid' or 'table'

// Filters
const filters = ref<FilterType>({
  category: '',
  subcategory: '',
  status: '',
  priceMin: undefined,
  priceMax: undefined,
  areaMin: undefined,
  areaMax: undefined,
  rooms: undefined,
  featured: undefined
})

const currentUser = computed(() => userStore.currentUser)

// Filtered properties
const filteredProperties = computed(() => {
  let result = [...propertiesStore.properties]
  
  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }
  
  if (filters.value.subcategory) {
    result = result.filter(p => p.subcategory === filters.value.subcategory)
  }
  
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.priceMin !== undefined) {
    result = result.filter(p => p.price >= filters.value.priceMin!)
  }
  
  if (filters.value.priceMax !== undefined) {
    result = result.filter(p => p.price <= filters.value.priceMax!)
  }
  
  if (filters.value.featured !== undefined) {
    result = result.filter(p => p.featured === filters.value.featured)
  }
  
  if (filters.value.rooms !== undefined) {
    result = result.filter(p => p.details?.rooms === filters.value.rooms)
  }
  
  return result
})

const addNewProperty = () => {
  router.push('/properties/add')
}

const clearFilters = () => {
  filters.value = {
    category: '',
    subcategory: '',
    status: '',
    priceMin: undefined,
    priceMax: undefined,
    areaMin: undefined,
    areaMax: undefined,
    rooms: undefined,
    featured: undefined
  }
}

const handleFilterChange = (newFilters: FilterType) => {
  filters.value = { ...newFilters }
}

onMounted(async () => {
  if (currentUser.value && currentUser.value.id) {
    try {
      await propertiesStore.fetchUserProperties(currentUser.value.id)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Объекты недвижимости</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Управляйте всеми вашими объектами недвижимости
        </p>
      </div>
      <div class="mt-4 md:mt-0">
        <button 
          @click="addNewProperty"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          <i class="pi pi-plus mr-2"></i>
          Добавить объект
        </button>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
      <PropertyFilter 
        :filters="filters" 
        @filter-change="handleFilterChange"
        @clear-filters="clearFilters"
      />
    </div>
    
    <div class="mb-4 flex justify-between items-center">
      <div>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Найдено объектов: {{ filteredProperties.length }}
        </span>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="currentView = 'grid'" 
          class="p-2 rounded-md"
          :class="currentView === 'grid' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'">
          <i class="pi pi-th-large"></i>
        </button>
        <button 
          @click="currentView = 'table'" 
          class="p-2 rounded-md"
          :class="currentView === 'table' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'">
          <i class="pi pi-list"></i>
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else-if="filteredProperties.length === 0" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
      <i class="pi pi-building text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Нет объектов недвижимости</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ propertiesStore.properties.length === 0 ? 
          'У вас пока нет объектов недвижимости.' : 
          'Нет объектов, соответствующих заданным фильтрам.' }}
      </p>
      <div class="flex justify-center gap-4">
        <button 
          v-if="propertiesStore.properties.length === 0"
          @click="addNewProperty"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          <i class="pi pi-plus mr-2"></i>
          Добавить объект
        </button>
        <button 
          v-else
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
        >
          <i class="pi pi-filter-slash mr-2"></i>
          Сбросить фильтры
        </button>
      </div>
    </div>
    
    <div v-else>
      <!-- Grid View -->
      <div v-if="currentView === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyCard 
          v-for="property in filteredProperties" 
          :key="property.id" 
          :property="property"
        />
      </div>
      
      <!-- Table View -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Название
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Категория
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Цена
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Адрес
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr v-for="property in filteredProperties" :key="property.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                      <img v-if="property.images && property.images.length > 0" :src="property.images[0]" alt="" class="h-10 w-10 object-cover">
                      <div v-else class="h-10 w-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <i class="pi pi-image text-gray-400"></i>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ property.title }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        ID: {{ property.id.substring(0, 8) }}...
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ property.category }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ property.subcategory }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(property.price) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ property.priceType === 'fixed' ? 'Фиксированная' : 
                       property.priceType === 'negotiable' ? 'Договорная' : 'Контракт' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': property.status === 'active',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400': property.status === 'pending',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400': property.status === 'sold',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400': property.status === 'archived'
                    }"
                  >
                    {{ property.status === 'active' ? 'Активно' : 
                       property.status === 'pending' ? 'В ожидании' : 
                       property.status === 'sold' ? 'Продано' : 'Архив' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ property.address?.city }}, {{ property.address?.street }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/properties/${property.id}`" class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">
                    <i class="pi pi-eye"></i>
                  </router-link>
                  <router-link :to="`/properties/${property.id}/edit`" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                    <i class="pi pi-pencil"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>