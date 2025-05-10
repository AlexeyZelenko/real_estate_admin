<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '../../stores/properties'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()

const isLoading = ref(true)
const activeImageIndex = ref(0)
const showImageGallery = ref(false)

// Load property data
onMounted(async () => {
  try {
    await propertiesStore.fetchProperty(route.params.id as string)
  } catch (error) {
    console.error('Error loading property:', error)
  } finally {
    isLoading.value = false
  }
})

const property = computed(() => propertiesStore.currentProperty)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
  }).format(price)
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

const editProperty = () => {
  router.push(`/properties/${property.value?.id}/edit`)
}

const showImage = (index: number) => {
  activeImageIndex.value = index
  showImageGallery.value = true
}

const nextImage = () => {
  if (!property.value?.images) return
  activeImageIndex.value = (activeImageIndex.value + 1) % property.value.images.length
}

const previousImage = () => {
  if (!property.value?.images) return
  activeImageIndex.value = activeImageIndex.value === 0
      ? property.value.images.length - 1
      : activeImageIndex.value - 1
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="!property" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Объект не найден</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Запрашиваемый объект недвижимости не существует или был удален
      </p>
      <div class="mt-6">
        <router-link
            to="/properties"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Вернуться к списку
        </router-link>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ property.title }}</h1>
          <div class="mt-2 flex items-center space-x-4">
            <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
              {{ formatPrice(property.price) }}
            </span>
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(property.status)"
            >
              {{ property.status === 'active' ? 'Активно' :
                property.status === 'pending' ? 'В ожидании' :
                    property.status === 'sold' ? 'Продано' : 'Архив' }}
            </span>
          </div>
        </div>

        <div class="mt-4 md:mt-0 flex space-x-3">
          <button
              @click="editProperty"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <i class="pi pi-pencil mr-2"></i>
            Редактировать
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Images -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="relative aspect-w-16 aspect-h-9">
              <img
                  v-if="property.images && property.images.length > 0"
                  :src="property.images[0]"
                  :alt="property.title"
                  class="w-full h-full object-cover cursor-pointer"
                  @click="showImage(0)"
              />
              <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <i class="pi pi-image text-4xl text-gray-400"></i>
              </div>
            </div>

            <!-- Thumbnail Grid -->
            <div v-if="property.images && property.images.length > 1" class="grid grid-cols-4 gap-2 p-4">
              <div
                  v-for="(image, index) in property.images.slice(1, 5)"
                  :key="index"
                  class="relative aspect-w-1 aspect-h-1 cursor-pointer"
                  @click="showImage(index + 1)"
              >
                <img
                    :src="image"
                    :alt="`${property.title} - изображение ${index + 2}`"
                    class="w-full h-full object-cover rounded"
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Описание</h2>
            <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {{ property.description }}
            </p>
          </div>

          <!-- Details -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Характеристики</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center space-x-2">
                <i class="pi pi-building text-gray-400"></i>
                <span class="text-gray-600 dark:text-gray-400">Площадь:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ property.details?.area }} м²
                </span>
              </div>

              <div v-if="property.details?.rooms" class="flex items-center space-x-2">
                <i class="pi pi-home text-gray-400"></i>
                <span class="text-gray-600 dark:text-gray-400">Комнат:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ property.details.rooms }}
                </span>
              </div>

              <div v-if="property.details?.floor" class="flex items-center space-x-2">
                <i class="pi pi-sort text-gray-400"></i>
                <span class="text-gray-600 dark:text-gray-400">Этаж:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ property.details.floor }}/{{ property.details.floors }}
                </span>
              </div>

              <div v-if="property.details?.yearBuilt" class="flex items-center space-x-2">
                <i class="pi pi-calendar text-gray-400"></i>
                <span class="text-gray-600 dark:text-gray-400">Год постройки:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ property.details.yearBuilt }}
                </span>
              </div>
            </div>

            <!-- Amenities -->
            <div v-if="property.amenities && property.amenities.length > 0" class="mt-6">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Удобства</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div
                    v-for="amenity in property.amenities"
                    :key="amenity"
                    class="flex items-center space-x-2"
                >
                  <i class="pi pi-check text-green-500"></i>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ amenity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Contact Info -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Контактная информация</h2>
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Контактное лицо</label>
                <p class="mt-1 text-gray-900 dark:text-white font-medium">
                  {{ property.contactInfo.name }}
                </p>
              </div>

              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Телефон</label>
                <p class="mt-1">
                  <a
                      :href="`tel:${property.contactInfo.phone}`"
                      class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    {{ property.contactInfo.phone }}
                  </a>
                </p>
              </div>

              <div v-if="property.contactInfo.email">
                <label class="text-sm text-gray-500 dark:text-gray-400">Email</label>
                <p class="mt-1">
                  <a
                      :href="`mailto:${property.contactInfo.email}`"
                      class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    {{ property.contactInfo.email }}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Расположение</h2>
            <div class="space-y-2">
              <p class="text-gray-600 dark:text-gray-400">
                <i class="pi pi-map-marker mr-2"></i>
                {{ property.address.city }}, {{ property.address.street }}
              </p>
              <p v-if="property.address.zipCode" class="text-gray-600 dark:text-gray-400">
                <i class="pi pi-inbox mr-2"></i>
                {{ property.address.zipCode }}
              </p>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Дополнительно</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">ID объекта:</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ property.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Категория:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ property.category }}/{{ property.subcategory }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Добавлено:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ new Date(property.createdAt.seconds * 1000).toLocaleDateString() }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Обновлено:</span>
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ new Date(property.updatedAt.seconds * 1000).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Gallery Modal -->
      <div v-if="showImageGallery" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>

          <div class="relative inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
            <div class="absolute top-0 right-0 pt-4 pr-4">
              <button
                  type="button"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="showImageGallery = false"
              >
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>

            <div class="relative aspect-w-16 aspect-h-9">
              <img
                  :src="property.images[activeImageIndex]"
                  :alt="`${property.title} - изображение ${activeImageIndex + 1}`"
                  class="w-full h-full object-contain"
              />
            </div>

            <div class="absolute inset-y-0 left-0 flex items-center">
              <button
                  class="bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 ml-4 focus:outline-none"
                  @click="previousImage"
              >
                <i class="pi pi-chevron-left text-white text-xl"></i>
              </button>
            </div>

            <div class="absolute inset-y-0 right-0 flex items-center">
              <button
                  class="bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 mr-4 focus:outline-none"
                  @click="nextImage"
              >
                <i class="pi pi-chevron-right text-white text-xl"></i>
              </button>
            </div>

            <div class="absolute bottom-0 inset-x-0 p-4 flex justify-center bg-black bg-opacity-50">
              <span class="text-white">
                {{ activeImageIndex + 1 }} / {{ property.images.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>