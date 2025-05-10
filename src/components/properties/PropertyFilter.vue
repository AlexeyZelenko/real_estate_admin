<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { PropertyFilter } from '../../types/property'

const props = defineProps<{
  filters: PropertyFilter
}>()

const emit = defineEmits(['filter-change', 'clear-filters'])

const localFilters = reactive({ ...props.filters })
const showFilters = ref(false)

// Category structure
const categoryStructure = {
  apartments: {
    name: 'Квартири',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' },
      daily: { name: 'Посуточно' }
    }
  },
  rooms: {
    name: 'Комнаты',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' },
      daily: { name: 'Посуточно' }
    }
  },
  offices: {
    name: 'Офисы',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' },
      daily: { name: 'Посуточно' }
    }
  },
  houses: {
    name: 'Будинки',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' },
      daily: { name: 'Посуточно' }
    }
  },
  land: {
    name: 'Земельні ділянки',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' }
    }
  },
  commercial: {
    name: 'Комерційна нерухомість',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' },
      daily: { name: 'Посуточно' }
    }
  },
  garages: {
    name: 'Гаражі',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' }
    }
  },
  other: {
    name: 'Інше',
    subcategories: {
      rent: { name: 'Аренда' },
      sell: { name: 'Продажа' },
      exchange: { name: 'Обмен' }
    }
  }
}

// Convert to arrays for easier rendering
const categories = Object.entries(categoryStructure).map(([key, value]) => ({
  id: key,
  name: value.name
}))

const getSubcategories = (categoryId: string) => {
  if (!categoryId || !categoryStructure[categoryId as keyof typeof categoryStructure]) {
    return []
  }
  
  const subcategories = categoryStructure[categoryId as keyof typeof categoryStructure].subcategories
  return Object.entries(subcategories).map(([key, value]) => ({
    id: key,
    name: value.name
  }))
}

const subcategories = ref(getSubcategories(localFilters.category || ''))

// Status options
const statusOptions = [
  { id: 'active', name: 'Активные' },
  { id: 'pending', name: 'В ожидании' },
  { id: 'sold', name: 'Проданные' },
  { id: 'archived', name: 'Архивные' }
]

// Feature options
const featuredOptions = [
  { id: true, name: 'Премиум' },
  { id: false, name: 'Обычные' }
]

// Room options
const roomOptions = [
  { id: 1, name: '1 комната' },
  { id: 2, name: '2 комнаты' },
  { id: 3, name: '3 комнаты' },
  { id: 4, name: '4 комнаты' },
  { id: 5, name: '5+ комнат' }
]

// Update subcategories when category changes
watch(() => localFilters.category, (newCategory) => {
  subcategories.value = getSubcategories(newCategory || '')
  if (newCategory !== props.filters.category) {
    localFilters.subcategory = ''
  }
})

// Apply filters
const applyFilters = () => {
  emit('filter-change', { ...localFilters })
  showFilters.value = false
}

// Clear filters
const clearFilters = () => {
  // Reset local filters
  Object.keys(localFilters).forEach(key => {
    localFilters[key as keyof PropertyFilter] = undefined
  })
  
  localFilters.category = ''
  localFilters.subcategory = ''
  localFilters.status = ''
  
  // Notify parent
  emit('clear-filters')
  showFilters.value = false
}

// Toggle filters visibility
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}
</script>

<template>
  <div>
    <div class="p-4 flex flex-wrap gap-4">
      <button 
        @click="toggleFilters"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
      >
        <i class="pi pi-filter mr-2"></i>
        Фильтры
        <span v-if="Object.values(props.filters).some(value => value !== undefined && value !== '')" class="ml-2 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full text-xs">
          Активны
        </span>
      </button>
      
      <!-- Quick filter badges -->
      <div class="flex flex-wrap gap-2">
        <div v-if="props.filters.category" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          {{ categoryStructure[props.filters.category as keyof typeof categoryStructure]?.name || props.filters.category }}
          <button @click="() => { localFilters.category = ''; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="props.filters.subcategory" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          {{ categoryStructure[props.filters.category as keyof typeof categoryStructure]?.subcategories[props.filters.subcategory as keyof typeof categoryStructure[keyof typeof categoryStructure]['subcategories']]?.name || props.filters.subcategory }}
          <button @click="() => { localFilters.subcategory = ''; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="props.filters.status" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          {{ statusOptions.find(s => s.id === props.filters.status)?.name || props.filters.status }}
          <button @click="() => { localFilters.status = ''; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="props.filters.priceMin" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          От {{ props.filters.priceMin }} ₴
          <button @click="() => { localFilters.priceMin = undefined; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="props.filters.priceMax" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          До {{ props.filters.priceMax }} ₴
          <button @click="() => { localFilters.priceMax = undefined; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="props.filters.featured !== undefined" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          {{ props.filters.featured ? 'Премиум' : 'Обычные' }}
          <button @click="() => { localFilters.featured = undefined; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div v-if="props.filters.rooms" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center">
          {{ props.filters.rooms }} комн.
          <button @click="() => { localFilters.rooms = undefined; emit('filter-change', { ...localFilters }) }" class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <button 
          v-if="Object.values(props.filters).some(value => value !== undefined && value !== '')"
          @click="clearFilters"
          class="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 px-2 py-1.5 flex items-center"
        >
          <i class="pi pi-filter-slash mr-1"></i>
          Сбросить все
        </button>
      </div>
    </div>
    
    <!-- Expanded Filters -->
    <div v-if="showFilters" class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Категория
          </label>
          <select
            id="category"
            v-model="localFilters.category"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Все категории</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- Subcategory -->
        <div>
          <label for="subcategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Подкатегория
          </label>
          <select
            id="subcategory"
            v-model="localFilters.subcategory"
            :disabled="!localFilters.category"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
          >
            <option value="">Все подкатегории</option>
            <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
              {{ subcategory.name }}
            </option>
          </select>
        </div>
        
        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Статус
          </label>
          <select
            id="status"
            v-model="localFilters.status"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Все статусы</option>
            <option v-for="status in statusOptions" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
        
        <!-- Featured -->
        <div>
          <label for="featured" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Тип объявления
          </label>
          <select
            id="featured"
            v-model="localFilters.featured"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option :value="undefined">Все типы</option>
            <option v-for="option in featuredOptions" :key="String(option.id)" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>
        
        <!-- Price Range -->
        <div>
          <label for="priceMin" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Цена от
          </label>
          <input
            id="priceMin"
            type="number"
            v-model.number="localFilters.priceMin"
            placeholder="Мин. цена"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label for="priceMax" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Цена до
          </label>
          <input
            id="priceMax"
            type="number"
            v-model.number="localFilters.priceMax"
            placeholder="Макс. цена"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <!-- Rooms -->
        <div>
          <label for="rooms" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Количество комнат
          </label>
          <select
            id="rooms"
            v-model="localFilters.rooms"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option :value="undefined">Все варианты</option>
            <option v-for="option in roomOptions" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
        >
          <i class="pi pi-filter-slash mr-2"></i>
          Сбросить
        </button>
        <button
          @click="applyFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          <i class="pi pi-check mr-2"></i>
          Применить
        </button>
      </div>
    </div>
  </div>
</template>